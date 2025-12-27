<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CashierDashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportExportController;
use App\Http\Controllers\ReceiptController;

// ===============================
// Akses Terbuka (Tanpa Login)
// ===============================
Route::middleware('guest-only')->group(function () {
    Route::get('/', [AppController::class, 'landing'])->name('landing');
    Route::get('/login', [AppController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

// ===============================
// Setelah Login (Untuk Semua Role)
// ===============================
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // ===============================
    // ROLE: ADMIN SAJA
    // ===============================
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/dashboard/admin', [AppController::class, 'dashboard_admin'])->name('dashboard_admin');
        Route::get('/dashboard/admin/report', [AppController::class, 'report_admin'])->name('report_admin');
        Route::get('/dashboard/admin/stock-management', [AppController::class, 'stock_management'])->name('stock_management');
        Route::get('/dashboard/admin/user-management', [AppController::class, 'user_management'])->name('user_management');

        Route::prefix('dashboard/admin')->group(function () {
            Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
            Route::put('/restock/{id}', [DashboardController::class, 'restock'])->name('medications.restock');

            Route::get('/user-management', [UserController::class, 'index'])->name('users.index');
            Route::post('/user-management', [UserController::class, 'store'])->name('users.store');
            Route::put('/user-management/{id}', [UserController::class, 'update'])->name('users.update');
            Route::delete('/user-management/{id}', [UserController::class, 'destroy'])->name('users.destroy');
        });

        Route::get('/medications', [MedicationController::class, 'index']);
        Route::post('/medications', [MedicationController::class, 'store'])->name('add_medication');
        Route::put('/medications/{id}', [MedicationController::class, 'update'])->name('update_medication');
        Route::delete('/medications/{id}', [MedicationController::class, 'destroy'])->name('delete_medication');
        Route::post('/medications/{id}/restock', [MedicationController::class, 'restock'])->name('medications.restock');
        Route::get('/dashboard/admin', [MedicationController::class, 'dashboard'])->name('dashboard_admin');

        Route::get('/dashboard/admin/report', [ReportController::class, 'index'])->name('admin.report');
        Route::get('/admin/report/pdf', [ReportExportController::class, 'download'])->name('report.download');
    });

    // ===============================
    // ROLE: KASIR SAJA
    // ===============================
    Route::middleware(['role:kasir'])->group(function () {
        Route::get('/dashboard/kasir', [CashierDashboardController::class, 'dashboard'])->name('dashboard_kasir');
        Route::get('/dashboard/kasir/sales', [AppController::class, 'sales'])->name('sales');

        Route::get('/dashboard/kasir/sales', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('/dashboard/kasir/sales', [TransactionController::class, 'store'])->name('transactions.store');

        Route::get('/stok-obat', [CashierDashboardController::class, 'getLowStockItems']);
        Route::get('/obat-kedaluwarsa', [CashierDashboardController::class, 'getExpiringItems']);
    });

    // ===============================
    // CETAK STRUK - Dapat Diakses oleh Admin & Kasir
    // ===============================
    Route::get('/receipt/{invoice}', [ReceiptController::class, 'download']);

    // ===============================
    // Tes route (opsional)
    // ===============================
   

Route::middleware('auth')->get('/current-user', [UserController::class, 'getCurrentUser']);

});

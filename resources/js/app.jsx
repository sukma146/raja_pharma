import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "../css/app.css";
import MainLayout from "./layouts/MainLayout";
createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx");
        const page = (await pages[`./Pages/${name}.jsx`]()).default;

        // Tambahkan layout global jika belum ada
        page.layout =
            page.layout || ((page) => <MainLayout>{page}</MainLayout>);

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

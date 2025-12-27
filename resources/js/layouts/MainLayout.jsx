import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePage } from "@inertiajs/inertia-react";

const MainLayout = ({ children }) => {
    const { props } = usePage();

    // Menampilkan flash message dari backend (opsional)
    useEffect(() => {
        if (props.toast) {
            toast.success(props.toast); // tampilkan toast saat ada flash
        }
    }, [props.toast]);

    return (
        <>
            <main>{children}</main>
            {/* <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                draggable
                newestOnTop
            /> */}
        </>
    );
};

export default MainLayout;

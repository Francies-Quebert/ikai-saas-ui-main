import React from "react";
import "tailwindcss/tailwind.css";

const SidebarComponent = () => {
  return (
    <>
      <section className="bg-gray-300 "></section>
      <main className="px-2 mt-3 ">
        <div className="main-div">
          <div className="div-border ">
            <h1 className="menu-hdr">All Categories</h1>

            <div className="menu-list">
              <h1 className="m-list-item active:text-red-500">Paneer Tikka</h1>
              <h1 className="m-list-item active:text-red-500">
                Toast Sandwich
              </h1>
              <h1 className="m-list-item active:text-red-500">Masla Dosa</h1>
              <h1 className="m-list-item active:text-red-500">Pizza</h1>
              <h1 className="m-list-item active:text-red-500">Chicken Burger</h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SidebarComponent;

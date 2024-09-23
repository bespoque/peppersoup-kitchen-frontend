"use client";
import MenusFoodMenu from "@/src/components/MenusFoodMenuTabs";
import AddMenuItemForm from "@/src/components/AddMenuItemForm";
import React, { useRef, useState } from "react";

export default function Menus() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null); 
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const handleMenuSelection = (menuType: string) => {
    setSelectedMenu(menuType);
    setShowPopup(false);
  };

  const goBack = () => {
    setSelectedMenu(null); 
  };

  return (
    <div>
      {selectedMenu ? (
        <div>
          <button
            onClick={goBack}
            className="m-4 font-bold hover:underline flex items-center"
          >
            ← Back to Menu
          </button>
          <AddMenuItemForm menuType={selectedMenu} />
        </div>
      ) : (
        <div>
          <div className="flex justify-end items-center m-4">
            <button
              ref={buttonRef}
              onClick={togglePopup}
              className="bg-paleGreen text-black py-2 px-4 rounded shadow"
            >
              Add New Menu Item
            </button>
          </div>
          {showPopup && buttonRef.current && (
            <div
              className="mt-1 p-4 bg-white border rounded shadow absolute z-10"
              style={{
                top:
                  buttonRef.current.getBoundingClientRect().bottom +
                  window.scrollY,
                left: buttonRef.current.getBoundingClientRect().left,
              }}
            >
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleMenuSelection("Peppersoup")}>
                    To Peppersoup Menu
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMenuSelection("Sides")}>
                    To Sides Menu
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMenuSelection("Drinks")}>
                    To Drinks Menu
                  </button>
                </li>
              </ul>
            </div>
          )}
          <MenusFoodMenu />
        </div>
      )}
    </div>
  );
}

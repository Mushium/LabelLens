import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PrimeReactProvider, PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { ScrollPanel } from "primereact/scrollpanel";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Messages } from "primereact/messages";
import { useMountEffect } from "primereact/hooks";

function BasicLayout({ children, tabs, side, menu }) {
  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      url: "/",
    },
    {
      label: "Dashboard",
      icon: "pi pi-star",
      url: "/dashboard",
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      url: "/settings",
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      template: itemRenderer,
      url: "/settings",
    },
  ];

  const start = <></>;
  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
  );

  if (side) {
    return (
      <div className="card">
        {menu && (
          <div
            className="relative z-10 card"
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
          >
            <Menubar model={items} start={start} end={end} />
          </div>
        )}
        <Splitter style={{ height: "100vh" }}>
          <SplitterPanel
            className="flex align-items-center justify-content-center surface-ground"
            size={25}
            minSize={15}
          >
            <ScrollPanel style={{ width: "100%", height: "100%" }}>
              {tabs}
            </ScrollPanel>
          </SplitterPanel>

          <SplitterPanel
            className="flex align-items-center justify-content-center"
            size={75}
            minSize={65}
          >
            <ScrollPanel style={{ width: "100%", height: "100%" }}>
              {children}
            </ScrollPanel>
          </SplitterPanel>
        </Splitter>
      </div>
    );
  } else {
    return (
      <div className="card">
        {/* Foreground */}
        {menu && (
          <div
            className="relative z-10 card"
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
          >
            <Menubar model={items} start={start} end={end} />
          </div>
        )}

        <div
          className="fadein animation-duration-1000 flex align-items-center justify-content-center
        font-bold bg-primary border-round m-2 px-5 py-3"
        >
          <Splitter style={{ width: "100%", height: "100%" }}>
            <SplitterPanel
              className="flex align-items-center justify-content-center"
              size={100}
              minSize={100}
            >
              <ScrollPanel
                className="flex align-items-center justify-content-center"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {children}
              </ScrollPanel>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    );
  }
}

export default BasicLayout;

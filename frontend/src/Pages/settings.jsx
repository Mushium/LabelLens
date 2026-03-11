import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BasicLayout from "../components/BasicLayout";
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

function Settings() {
  return (
    <BasicLayout menu={true}>
      <div className="p-4 text-dark">
        <h2 className="fw-bold mb-3">Settings</h2>
        <p className="text-muted">
          Configure your preferences and manage account options here.
        </p>
      </div>
    </BasicLayout>
  );
}

export default Settings;

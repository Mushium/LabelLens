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

function Home() {
  const navigate = useNavigate();

  const tabs = (
    <div>
      <Button
        style={{ width: "100%" }}
        label="Home"
        severity="secondary"
        text
      />
      <Button
        style={{ width: "100%" }}
        label="DashBoard"
        severity="secondary"
        text
      />
      <Button
        style={{ width: "100%" }}
        label="Settings"
        severity="secondary"
        text
      />
    </div>
  );

  return (
    <BasicLayout tabs={tabs} side={false} menu={true}>
      <h1
        className="font-bold text-8xl"
        style={{
          background: "linear-gradient(to right, #54caa6, #4f7ec1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        All-in-One Tool for Image
        <br />
        Classification
      </h1>

      <h3
        style={{
          opacity: 0.7,
          textAlign: "center",
          width: "50%",
          margin: "0 auto",
          overflowWrap: "break-word",
        }}
      >
        Transform your machine learning workflow with Classifiery.com — a
        powerful, intuitive platform built for seamless image classification
        from start to finish.
      </h3>

      <div
        className="card flex justify-content-center"
        style={{ marginTop: "5%" }}
      >
        <Button
          label="Check It Out"
          size="large"
          onClick={() => navigate("/account")}
        />
      </div>
    </BasicLayout>
  );
}

export default Home;

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

function Account() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function SignIn() {
    const response = await fetch("http://127.0.0.1:5000/user", {
      method: "POST",
      headers: { username, password },
    });
    const data = await response.json();

    if (data["Result"] == false) {
      alert("User Already Exists");
    } else {
      alert("User Created");
      window.location.reload();
    }
  }

  async function LogIn() {
    const response = await fetch("http://127.0.0.1:5000/user", {
      method: "GET",
      headers: { username, password },
    });
    const data = await response.json();
    if (data["Result"] == false) {
      alert("User Not Found");
    } else {
      alert("User Login");
      localStorage.setItem("Token", data["Result"]);
      navigate("/dashboard");
    }
  }

  async function Auth() {
    const authkey = localStorage.getItem("Token");
    const response = await fetch("http://127.0.0.1:5000/auth", {
      headers: { authkey },
    });
    const data = await response.json();
    if (response.ok) {
      navigate("/dashboard");

      return;
    }
  }

  useEffect(() => {
    Auth();
  }, []);

  return (
    <div className="card ">
      <Splitter>
        <SplitterPanel
          className="flex align-items-center justify-content-center"
          size={50}
          minSize={50}
        >
          <img
            src="/LeftSideAccountImage.png"
            style={{ width: "100%", height: "100%" }}
          />
        </SplitterPanel>

        <SplitterPanel
          className="flex flex-column align-items-center justify-content-start"
          size={50}
          minSize={50}
        >
          <h1
            className="font-bold text-8xl"
            style={{
              textAlign: "center",
            }}
          >
            Account
          </h1>

          <div className="flex flex-column gap-6">
            <div className="flex flex-column gap-2">
              <label className="font-semibold">Username</label>
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex flex-column gap-2">
              <label className="font-semibold">Password</label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                feedback={false}
                className="w-full"
                placeholder="Enter your password"
              />
            </div>

            <Button
              label="Login"
              icon="pi pi-sign-in"
              className="w-full"
              onClick={LogIn}
            />

            <Divider align="center">
              <b>OR</b>
            </Divider>

            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              severity="success"
              className="w-full"
              onClick={SignIn}
            />
          </div>

          <div className="text-center mt-4">
            <Link to="/">
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                text
                severity="secondary"
              />
            </Link>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}

export default Account;

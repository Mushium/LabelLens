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

function Dashboard() {
  const navigate = useNavigate();
  const [models, setModels] = useState({});
  const [inputValue, setInputValue] = useState("");

  async function GetModels() {
    const authkey = localStorage.getItem("Token");

    const response = await fetch("http://127.0.0.1:5000/models", {
      method: "GET",
      headers: { authkey },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
    setModels(data);
  }

  async function PostModels(name) {
    const authkey = localStorage.getItem("Token");
    if (!name) return;
    const response = await fetch("http://127.0.0.1:5000/models", {
      method: "POST",
      headers: { authkey, name },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
    window.location.reload();
  }

  async function DeleteModels(name) {
    const authkey = localStorage.getItem("Token");
    if (!name) return;
    const response = await fetch("http://127.0.0.1:5000/models", {
      method: "DELETE",
      headers: { authkey, name },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
    window.location.reload();
  }

  async function Auth() {
    const authkey = localStorage.getItem("Token");
    const response = await fetch("http://127.0.0.1:5000/auth", {
      headers: { authkey },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
  }

  useEffect(() => {
    GetModels();
    Auth();
  }, []);

  const handleButtonClick = () => PostModels(inputValue);
  async function SignOut() {
    const authkey = localStorage.getItem("Token");

    const response = await fetch("http://127.0.0.1:5000/key", {
      headers: { authkey },
    });
    const data = await response.json();
    alert("Signed out");
    localStorage.removeItem("Token");
    navigate("/account");
  }

  const tabs = (
    <div>
      <Button
        style={{ width: "100%" }}
        label="Sign Out"
        onClick={SignOut}
        severity="secondary"
        text
      />
    </div>
  );

  const header = <></>;

  return (
    <BasicLayout tabs={tabs} side={true} menu={true}>
      <div className="flex flex-column align-items-center gap-3 p-3">
        <h1
          className="font-bold text-6xl"
          style={{
            textAlign: "center",
          }}
        >
          Your Models
        </h1>

        <div className="flex justify-content-center w-full">
          <div className="p-inputgroup" style={{ width: "70%" }}>
            <InputText
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter model name"
            />
            <Button label="Create" onClick={handleButtonClick} />
          </div>
        </div>

        <div className="flex flex-wrap justify-content-center gap-3 mt-3">
          {Object.entries(models).map(([key, value]) => {
            let footer = (
              <>
                <Button
                  label="Open"
                  icon={PrimeIcons.DOWNLOAD}
                  onClick={() => navigate(`/model?model=${key}`)}
                />
                <Button
                  label="Delete"
                  severity="secondary"
                  icon="pi pi-trash"
                  style={{ marginLeft: "0.5em" }}
                  onClick={() => DeleteModels(key)}
                />
              </>
            );

            return (
              <div className="flex flex-wrap align-items-center justify-content-center">
                <div
                  className="fadein animation-duration-1000 flex align-items-center justify-content-center
        font-bold bg-primary border-round m-2 px-5 py-3"
                >
                  <Card
                    title={key}
                    subTitle="Number of classes:"
                    footer={footer}
                    header={header}
                    className="md:w-25rem"
                  >
                    <p className="m-0">{value}</p>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BasicLayout>
  );
}

export default Dashboard;

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
import { Flag } from "lucide-react";
import { Dialog } from "primereact/dialog";
function Model() {
  const [classes, setClasses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const model = new URLSearchParams(window.location.search).get("model");
  const navigate = useNavigate();

  async function GetClasses() {
    const authkey = localStorage.getItem("Token");

    const response = await fetch("https://labellens.onrender.com/classes", {
      method: "GET",
      headers: { authkey, model },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
    setClasses(data);
  }

  async function PostClasses(className) {
    const authkey = localStorage.getItem("Token");
    if (!className) return;
    const response = await fetch("https://labellens.onrender.com/classes", {
      method: "POST",
      headers: { authkey, model, className },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
    window.location.reload();
  }

  async function DeleteClasses(className) {
    const authkey = localStorage.getItem("Token");
    if (!className) return;
    const response = await fetch("https://labellens.onrender.com/classes", {
      method: "DELETE",
      headers: { authkey, model, className },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
    window.location.reload();
  }

  async function uploadWithSignedUrl(file, className) {
    try {
      const authkey = localStorage.getItem("Token");
      const contentType = file.type;
      const response = await fetch("https://labellens.onrender.com/signed-upload-url", {
        method: "POST",
        headers: { authkey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          contentType: contentType,
          className: className,
        }),
      });

      const { signed_url } = await response.json();
      console.log(signed_url);

      const put = await fetch(signed_url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType || "application/octet-stream",
        },
        body: file,
      });
    } catch (error) {
      console.error("Network or Fetch Error:", error);
    }
  }

  async function Auth() {
    const authkey = localStorage.getItem("Token");
    const response = await fetch("https://labellens.onrender.com/auth", {
      headers: { authkey },
    });
    const data = await response.json();
    if (!response.ok) {
      navigate("/account");

      return;
    }
  }

  async function Generate() {
    const authkey = localStorage.getItem("Token");

    setVisible(true);
    const response = await fetch("https://labellens.onrender.com/generate", {
      method: "POST",
      headers: { authkey, model },
    });

    const data = await response.json();
    if (data["Result"] == false) {
      alert("Needs More Data");
    }

    setVisible(false);

    if (!response.ok) {
      navigate("/account");
      return;
    }
  }

  async function Predict(uploadEvent) {
    const authkey = localStorage.getItem("Token");
    const file = uploadEvent.files[0];

    const data = new FormData();
    data.append("file", file);

    const response = await fetch("https://labellens.onrender.com/predict", {
      method: "POST",
      headers: { authkey, model },
      body: data,
    });

    const result = await response.json();

    alert(result["Result"]);
  }

  async function SignOut() {
    const authkey = localStorage.getItem("Token");

    const response = await fetch("https://labellens.onrender.com/key", {
      headers: { authkey },
    });
    const data = await response.json();
    alert("Signed out");
    localStorage.removeItem("Token");
    navigate("/account");
  }

  useEffect(() => {
    GetClasses();
    Auth();
  }, []);

  const handleButtonClick = () => PostClasses(inputValue);
  const tabs = (
    <div className="flex flex-column gap-2">
      <Button
        style={{ width: "100%" }}
        label="Generate"
        onClick={() => Generate()}
        severity="warning"
        icon="pi pi-chart-scatter"
      />
      <FileUpload
        chooseOptions={{
          label: "Predict",
          icon: "pi pi-bullseye",
          className: "w-full",
        }}
        mode="basic"
        name="file"
        accept="image/*"
        auto
        customUpload
        uploadHandler={Predict}
      />
      <Button
        style={{ width: "100%" }}
        label="Back"
        onClick={() => navigate("/dashboard")}
        severity="secondary"
        text
      />
      <Button
        style={{ width: "100%" }}
        label="Sign Out"
        onClick={SignOut}
        severity="secondary"
        text
      />
    </div>
  );

  return (
    <BasicLayout tabs={tabs} side={true} menu={true}>
      <Dialog visible={visible} style={{ width: "50vw" }} closable={false}>
        <p className="text-center font-bold text-4xl">Loading...</p>
      </Dialog>
      <div className="flex flex-column align-items-center gap-3 p-3">
        <h1
          className="font-bold text-6xl"
          style={{
            textAlign: "center",
          }}
        >
          {model}
        </h1>
        <div className="flex justify-content-center w-full">
          <div className="p-inputgroup" style={{ width: "70%" }}>
            <InputText
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter class name"
            />
            <Button label="Add" onClick={handleButtonClick} />
          </div>
        </div>

        <div className="flex flex-wrap justify-content-center gap-2 mt-3">
          {Object.entries(classes).map(([key, value]) => {
            let footer = (
              <div className="card flex flex-column gap-5">
                <FileUpload
                  name="uploadedFiles"
                  customUpload
                  multiple
                  uploadHandler={async (e) => {
                    await Promise.all(
                      e.files.map((f) => uploadWithSignedUrl(f, key)),
                    );
                    window.location.reload();
                  }}
                  accept="image/*"
                  maxFileSize={10000000}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                />
                <Button
                  label="Delete"
                  severity="secondary"
                  icon="pi pi-trash"
                  style={{ marginLeft: "0.5em" }}
                  onClick={() => DeleteClasses(key)}
                />
              </div>
            );

            return (
              <div className="flex flex-wrap align-items-center justify-content-center">
                <div
                  className="fadein animation-duration-1000 flex align-items-center justify-content-center
        font-bold bg-primary border-round m-2 px-5 py-3"
                >
                  <Card
                    title={key}
                    subTitle="Number of Images:"
                    footer={footer}
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

export default Model;

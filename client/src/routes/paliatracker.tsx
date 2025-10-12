import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { selectAllArtifacts } from "../features/slices/ArtifactsSlice";
import { selectAllPlushies } from "../features/slices/PlushiesSlice";

import { mapItems } from "../features/trackerMapping/mainMapper";

export const Route = createFileRoute("/paliatracker")({
  component: ImportTracker,
});

function ImportTracker() {
  const { profile, bulkUpdateInventory } = useAuth();
  const {
    data: artifactData,
    isLoading: LoadArtifact,
    isError: ErrArtifact,
  } = selectAllArtifacts();
  const {
    data: plushiesData,
    isLoading: LoadPlushies,
    isError: ErrPlushies,
  } = selectAllPlushies();

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [extractedFileContent, setExtractedFileContent] = useState("");

  const [extraxtionMsg, setExtraxtionMsg] = useState("");
  const [extraxtionMsgType, setExtraxtionMsgType] = useState("info");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("");
      setFileContent("");
    }
  };

  const handleReadFile = () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first!");
      return;
    }

    if (
      selectedFile.type !== "application/json" &&
      !selectedFile.name.endsWith(".json")
    ) {
      setUploadStatus("Please select a JSON file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedJson = JSON.parse(content);
        setFileContent(JSON.stringify(parsedJson, null, 2));
        setUploadStatus(`File "${selectedFile.name}" loaded successfully.`);
      } catch (err) {
        setUploadStatus("Error reading or parsing the file.");
        console.error(err);
      }
    };

    reader.onerror = () => {
      setUploadStatus("Error reading the file.");
    };

    reader.readAsText(selectedFile);
  };

  const extractData = async (category: string) => {
    setExtraxtionMsgType("info");
    const json = JSON.parse(fileContent);

    let databaseData;
    let rawJsonData;

    if (category === "artifacts") {
      databaseData = artifactData;
      rawJsonData = json.trackedArtifact;
    } else if (category === "plushies") {
      databaseData = plushiesData;
      rawJsonData = json.trackedPlush;
    } else {
      setExtractedFileContent("");
      setExtraxtionMsgType("warning");
      setExtraxtionMsg("category not defined for extraction");
      return;
    }

    if (rawJsonData && rawJsonData) {
      const mappedData = mapItems(
        category,
        databaseData,
        rawJsonData,
        setUploadStatus
      );

      if (mappedData && mappedData.length > 0) {
        setExtractedFileContent(JSON.stringify(mappedData, null, 2));
        setTimeout(async () => {
          let msg = `Do you want to update your current ${category} inventory from this file? \n\nFile only includes if it is "obtained" and not amount. \nIf it is found in the file, your inventory is set to 1 for that item.`;
          if (category === "artifacts") {
            msg = `Do you want to update your current artifact inventory with this new data?`;
          }
          if (confirm(msg)) {
            const result = await bulkUpdateInventory(mappedData);
            if (result.success) {
              setExtraxtionMsgType("success");
              setExtraxtionMsg(
                `Plushies imported successfully. ${result.count} items were updated or inserted.`
              );
            } else {
              setExtraxtionMsgType("danger");
              setExtraxtionMsg(
                `Upload failed: ${result.error || "An unknown error occurred."}`
              );
            }
          } else {
            setExtraxtionMsgType("info");
            setExtraxtionMsg(`Update of inventory aborted.`);
          }
        }, 100);
      } else {
        setExtractedFileContent(`failed to map ${category}`);
      }
    } else {
      // failed
    }
  };

  useEffect(() => {
    handleReadFile();
  }, [selectedFile]);

  return (
    <div className="container-fluid">
      <div className="row">
        {!profile && (
          <div className="col text-center bg-danger py-2 fw-bold">
            You need to be logged in for this to work
          </div>
        )}
      </div>
      <div className="row m-1">
        <div className="col-12 col-md-6 my-2">
          <div className="row">
            <div className="col ">
              <div className="p-2">
                <label
                  htmlFor="json-upload"
                  className="btn btn-primary shadow-sm"
                >
                  <i className="bi bi-folder-fill me-2"></i>
                  Choose JSON Tracker File
                </label>
                <input
                  id="json-upload"
                  className="visually-hidden"
                  type="file"
                  onChange={handleFileChange}
                  accept=".json,application/json"
                />
              </div>
              <div className="p-2">
                {uploadStatus && <em>{uploadStatus}</em>}
              </div>
            </div>

            <hr />

            <div className="col">
              <b>File Content:</b>
              <textarea
                value={fileContent}
                rows={8}
                className="form-control"
                readOnly
                placeholder="JSON content will appear here after reading the file..."
                style={{ width: "100%", fontFamily: "monospace" }}
              />
              <div className="d-flex flex-wrap">
                <button
                  className="btn btn-primary shadow-sm m-1"
                  onClick={() => extractData("artifacts")}
                  disabled={
                    profile && artifactData && fileContent ? false : true
                  }
                >
                  <i className="bi bi-file-earmark-code me-1"></i>
                  {LoadArtifact
                    ? "Loading artifacts.."
                    : ErrArtifact
                      ? "Failed getting artifacts"
                      : !LoadArtifact && !ErrArtifact && artifactData
                        ? "Extract artifacts"
                        : null}
                </button>

                <button
                  className="btn btn-primary shadow-sm m-1"
                  onClick={() => extractData("plushies")}
                  disabled={
                    profile && plushiesData && fileContent ? false : true
                  }
                >
                  <i className="bi bi-file-earmark-code me-1"></i>
                  {LoadPlushies
                    ? "Loading plushies.."
                    : ErrPlushies
                      ? "Failed getting plushies"
                      : !LoadPlushies && !ErrPlushies && plushiesData
                        ? "Extract plushies"
                        : null}
                </button>
              </div>
              <pre className="d-none" style={{ height: "100%" }}>
                {fileContent}
              </pre>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 my-2">
          {extraxtionMsg && (
            <div
              className={
                (extraxtionMsgType
                  ? `bg-${extraxtionMsgType} text-dark`
                  : " text-dark") + " rounded p-2"
              }
            >
              {extraxtionMsg}
            </div>
          )}
          {extractedFileContent && (
            <>
              <div>Extracted json: </div>
              <pre style={{ height: "100%", color: "gray" }}>
                {extractedFileContent}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { selectAllArtifacts } from "../features/slices/ArtifactsSlice";
import { type UserInventoryItem } from "../app/types/userTypes";

import artifactMap, {
  type artifactMapType,
} from "../features/trackerMapping/artifactMap";

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

  const extractArtifacts = async () => {
    setExtraxtionMsgType("info");

    const json = JSON.parse(fileContent);
    const rawArtifacts = json.trackedArtifact;
    setExtractedFileContent(JSON.stringify(rawArtifacts, null, 2));

    if (!artifactData) {
      setUploadStatus("Artifact data not yet loaded. Please wait.");
      return;
    }
    const nameToItemMap = new Map(
      artifactData.map((artifact) => [artifact.name, artifact])
    );

    const mappedArtifacts: UserInventoryItem[] = rawArtifacts
      .map((item: { key: string; amount: number }) => {
        const rawArtifactName =
          artifactMap[item.key as keyof artifactMapType] || item.key;

        const artifactEntry = nameToItemMap.get(rawArtifactName);

        if (artifactEntry) {
          return {
            category: "artifacts",
            itemId: artifactEntry.id,
            amount: item.amount,
          };
        }
        return null;
      })
      .filter((item: UserInventoryItem) => item !== null);

    if (mappedArtifacts && mappedArtifacts.length === rawArtifacts.length) {
      setExtractedFileContent(JSON.stringify(mappedArtifacts, null, 2));
      setTimeout(async () => {
        if (
          confirm(
            "Do you want to update your current artifact inventory with this new data?"
          )
        ) {
          const result = await bulkUpdateInventory(mappedArtifacts);

          if (result.success) {
            setExtraxtionMsgType("success");
            setExtraxtionMsg(
              `Artifacts imported successfully. ${result.count} items were updated or inserted.`
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
      setExtractedFileContent("failed to map artifacts");
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
                  className="btn btn-secondary shadow-sm m-1"
                  onClick={extractArtifacts}
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
                  ? `bg-${extraxtionMsgType} text-light`
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

import React, { useContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";

export default function RunStatus() {
  const { runId } = useParams();
  const { apiKey } = useContext(ApiContext);
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // Reset state when runId changes
    setStatus("PENDING");
    setItems(null);
    setError(null);

    // Redirect to home if no API key is set
    if (!apiKey) {
      nav("/");
      return;
    }

    let isActive = true; // Flag to prevent state updates if component unmounts

    const pollRunStatus = async () => {
      try {
        let currentStatus = "PENDING";
        let run = null;

        // Keep polling while the run is still in progress
        while (
          !["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"].includes(
            currentStatus
          ) &&
          isActive
        ) {
          try {
            // Direct API call to Apify
            const statusResp = await axios.get(
              `https://api.apify.com/v2/actor-runs/${runId}`,
              { headers: { Authorization: `Bearer ${apiKey}` } }
            );

            run = statusResp.data.data;
            currentStatus = run.status;

            // Only update state if component is still active
            if (isActive) {
              setStatus(currentStatus);
            }

            // If still running, wait before next poll
            if (["RUNNING", "PENDING"].includes(currentStatus) && isActive) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
            }
          } catch (err) {
            console.error("Error polling run status:", err);
            if (isActive) {
              setError("Failed to fetch run status");
            }
            break;
          }
        }

        // Once done, fetch dataset if available
        if (run && run.defaultDatasetId && isActive) {
          try {
            const itemsResp = await axios.get(
              `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items`,
              { headers: { Authorization: `Bearer ${apiKey}` } }
            );
            if (isActive) {
              setItems(itemsResp.data);
            }
          } catch (err) {
            console.error("Error fetching items:", err);
            // Don't set error here as the run succeeded, just no items available
          }
        }
      } catch (err) {
        console.error("Error in polling:", err);
        if (isActive) {
          setError("Failed to monitor run status");
        }
      }
    };

    pollRunStatus();

    // Cleanup function to prevent state updates after component unmounts or runId changes
    return () => {
      isActive = false;
    };
  }, [runId, apiKey, nav]); // Intentionally not including 'items' to allow reset on runId change

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCEEDED":
        return "text-green-600 bg-green-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      case "TIMED-OUT":
        return "text-yellow-600 bg-yellow-100";
      case "ABORTED":
        return "text-gray-600 bg-gray-100";
      case "RUNNING":
        return "text-blue-600 bg-blue-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-white">Run Status</h1>
                <p className="text-blue-100 text-sm font-mono">{runId}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 font-medium">Error</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {["RUNNING", "PENDING"].includes(status) && (
            <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin w-8 h-8 text-blue-500 mr-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="text-center">
                  <div className="text-blue-700 font-semibold text-lg">
                    {status === "RUNNING"
                      ? "Actor is running..."
                      : "Waiting for actor to start..."}
                  </div>
                  <p className="text-blue-600 mt-1 text-sm">
                    This may take a few minutes. We'll update automatically
                    every 5 seconds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "SUCCEEDED" && items && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Results</h2>
                <span className="text-sm text-gray-500">
                  {Array.isArray(items) ? items.length : "N/A"} items
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <pre className="bg-white p-4 rounded-lg border max-h-96 overflow-auto text-sm leading-relaxed">
                  {JSON.stringify(items, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {status === "SUCCEEDED" && !items && (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <svg
                className="w-12 h-12 text-yellow-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-yellow-800 font-semibold text-lg mb-2">
                No Results
              </h3>
              <p className="text-yellow-600">
                The actor completed successfully but didn't produce any output
                data.
              </p>
            </div>
          )}

          {["FAILED", "TIMED-OUT", "ABORTED"].includes(status) && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-red-800 font-semibold text-lg mb-2">
                {status === "FAILED" && "Execution Failed"}
                {status === "TIMED-OUT" && "Execution Timed Out"}
                {status === "ABORTED" && "Execution Aborted"}
              </h3>
              <p className="text-red-600">
                {status === "FAILED" &&
                  "The actor encountered an error during execution."}
                {status === "TIMED-OUT" &&
                  "The actor execution exceeded the time limit."}
                {status === "ABORTED" &&
                  "The actor execution was manually stopped."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

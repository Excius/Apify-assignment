import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import axios from "../utils/axios";
import { ApiContext } from "../context/ApiContext";
import "../App.css";

export default function ActorForm() {
  const { id } = useParams();
  const { apiKey } = useContext(ApiContext);
  const [schema, setSchema] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const nav = useNavigate();

  // Redirect to home if no API key is set
  useEffect(() => {
    if (!apiKey) {
      nav("/");
      return;
    }
  }, [apiKey, nav]);

  useEffect(() => {
    if (!apiKey) return; // Don't fetch if no API key

    axios
      .get(`/api/actors/${id}/schema`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      .then((r) => {
        const rawSchema = r.data.schema;
        // Transform the schema to be compatible with @rjsf/core
        const transformedSchema = {
          title: rawSchema.title,
          type: rawSchema.type,
          properties: {},
          required: rawSchema.required || [],
        };

        // Transform each property to remove non-standard fields
        Object.keys(rawSchema.properties || {}).forEach((key) => {
          const prop = rawSchema.properties[key];
          transformedSchema.properties[key] = {
            title: prop.title,
            type: prop.type,
            description: prop.description,
            ...(prop.prefill && { default: prop.prefill }),
          };
        });

        setSchema(transformedSchema);
      })
      .catch(console.error);
  }, [id, apiKey]);

  if (!schema)
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <svg
              className="animate-spin w-6 h-6 text-blue-500 mr-3"
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
            <span className="text-gray-600 font-medium">
              Loading actor schema...
            </span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-white">Run Actor</h1>
              <p className="text-blue-100 text-sm font-mono">{id}</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <Form
            ref={formRef}
            schema={schema}
            validator={validator}
            onSubmit={({ formData }) => {
              setIsSubmitting(true);
              axios
                .post(
                  `/api/actors/${id}/run`,
                  { input: formData },
                  {
                    headers: { Authorization: `Bearer ${apiKey}` },
                  }
                )
                .then((r) => {
                  nav(`/runs/${r.data.runId}`);
                })
                .catch((err) => {
                  alert(
                    "Run failed: " + (err.response?.data?.error || err.message)
                  );
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            }}
            uiSchema={{
              "ui:submitButtonOptions": {
                norender: true,
              },
            }}
          />

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => formRef.current?.submit()}
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105 hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-6 h-6 mr-3"
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
                  Running Actor...
                </>
              ) : (
                <>Start Actor Run</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

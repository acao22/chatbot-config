"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Action = {
  name: string;
  type: "AcceptOffer" | "RejectOffer" | "SubmitBotInstruction";
  instruction?: string;
};

// the sample starting config (i just hardcoded for now)
const defaultConfig: { name: string; version: string; actions: Action[] } = {
  name: "exampleConfig",
  version: "0.1.8",
  actions: [
    { name: "rejectOffer1", type: "RejectOffer" },
    {
      name: "BuyerNeedsBathroom",
      type: "SubmitBotInstruction",
      instruction:
        "The Buyer needs to use the bathroom and should say so in the next message.",
    },
    { name: "acceptOffer", type: "AcceptOffer" },
    {
      name: "tell a joke",
      type: "SubmitBotInstruction",
      instruction: "The Buyer should tell a joke.",
    },
  ],
};

// action types for the select dropdown from shadcn ui
const actionTypes = [
  {
    value: "AcceptOffer",
    label: "Accept Offer",
  },
  {
    value: "RejectOffer",
    label: "Reject Offer",
  },
  {
    value: "SubmitBotInstruction",
    label: "Submit Bot Instruction",
  },
];

// the main ConfigEditor component
const ConfigEditor = ({
  config,
}: {
  config: { name: string; version: string; actions: Action[] };
}) => {
  const [editableConfig, setEditableConfig] = useState(config);
  const scrollContainerRef = useRef<HTMLDivElement>(null); // ref for scrollable container
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // alert message
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null); // type of alert

  // edit name/instruction function
  const handleEditAction = (index: number, updatedAction: Action | null) => {
    const updatedActions = [...editableConfig.actions];
    if (updatedAction === null) {
      // rm action
      updatedActions.splice(index, 1);
    } else {
      // update action
      updatedActions[index] = updatedAction;
    }
    setEditableConfig({ ...editableConfig, actions: updatedActions });
  };

  // add a new action and show the success alert function
  const addNewAction = (type: "AcceptOffer" | "RejectOffer" | "SubmitBotInstruction") => {
    const newAction: Action = { name: "", type: type };
    setEditableConfig({
      ...editableConfig,
      actions: [...editableConfig.actions, newAction],
    });

    // success alert for new action
    setAlertMessage(`${type} created, please fill in the corresponding information :)`);
    setAlertType("success");
  };


  // scroll to bottom of right panel whenever the action list is updated
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [editableConfig.actions]);

  // checking for duplicate names
  const hasDuplicateNames = editableConfig.actions.some(
    (action: Action, index: number, array: Action[]) =>
      array.findIndex((a) => a.name === action.name) !== index &&
      action.name.trim() !== ""
  );

  // duplicate warning function
  const showDuplicateWarning = () => {
    if (hasDuplicateNames) {
      setAlertMessage("Two or more actions have the same name - please ensure each action has a unique name!");
      setAlertType("error");
    } else {
      setAlertType(null);
    }
  };

  // exporting config to console
  const exportConfig = () => {
    if (!hasDuplicateNames) {
      // alert for successful config export
      console.log(JSON.stringify(editableConfig, null, 2));
      setAlertMessage("Success - JSON printed to console!");
      setAlertType("success");
    } else {
      showDuplicateWarning();
    }
  };

  // select dropdown for choosing action types
  const ActionTypeSelect = ({
    selectedType,
    onSelectType,
  }: {
    selectedType: string;
    onSelectType: (type: string) => void;
  }) => {
    return (
      <Select onValueChange={onSelectType} value={selectedType}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select action type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Action Types</SelectLabel>
            {actionTypes.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 font-inter">
      <h2 className="text-2xl font-semibold mb-6 text-center">Config Editor</h2>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left Panel: user input */}
        <div className="w-full lg:w-1/4 sticky top-10 space-y-6">
          <Card className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Action</h2>
            <ActionTypeSelect
              selectedType=""
              onSelectType={(type: string) => addNewAction(type as "AcceptOffer" | "RejectOffer" | "SubmitBotInstruction")}
            />
            <Button
              onClick={exportConfig}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:bg-indigo-700 hover:scale-105"
            >
              Export Config
            </Button>
          </Card>
          {alertType === "success" && (
            <Alert className="mt-4 bg-green-100">
              <AlertTitle className="font-bold">Success</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          {alertType === "error" && (
            <Alert className="mt-4 bg-red-100">
              <AlertTitle className="font-bold">Duplicate Action Names</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Panel: list of actions */}
        <div
          ref={scrollContainerRef}
          className="w-full lg:w-3/4 overflow-y-auto h-[60vh] lg:h-[80vh] space-y-4"
        >
          <div className="space-y-4">
            {editableConfig.actions.map((action: Action, index: number) => (
              <Card key={index} className="p-6 bg-white rounded-lg shadow-md">
                <input
                  type="text"
                  value={action.name}
                  onChange={(e) =>
                    handleEditAction(index, { ...action, name: e.target.value })
                  }
                  placeholder="Action Name"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <ActionTypeSelect
                  selectedType={action.type}
                  onSelectType={(type) =>
                    handleEditAction(index, { ...action, type: type as any })
                  }
                />
                {action.type === "SubmitBotInstruction" && (
                  <input
                    type="text"
                    value={action.instruction || ""}
                    onChange={(e) =>
                      handleEditAction(index, {
                        ...action,
                        instruction: e.target.value,
                      })
                    }
                    placeholder="Instruction"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                )}
                <Button
                  onClick={() => handleEditAction(index, null)}
                  className="text-red-500 bg-gray-100 py-2 px-4 rounded-lg transition-all duration-300 transform hover:bg-red-500 hover:text-white hover:scale-105"
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <ConfigEditor config={defaultConfig} />
    </div>
  );
};

export default App;

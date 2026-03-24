import { createBrowserRouter } from "react-router-dom";
import App from "../ProjectChatbot/ProjectChatbot/ChatbotProject/Frontend/src/App.jsx";
import ExperimentFlowPage from "./ExperimentConfigPages/ExperimentFlowPage.jsx";
import SurveyTemplatePicker from "./ExperimentConfigPages/SurveyTemplatePicker.jsx";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <div className="text-gray-600">Choose a page from the left.</div> },
      { path: "experiment-flow", element: <ExperimentFlowPage /> },
      { path: "surveys", element: <SurveyTemplatePicker /> },
    ],
  },
]);

import { User } from "../models/User.js";
import { Workflows } from "../models/Workflows.js";

export const onCreateNodesEdges = async (req, res) => {
  const { flowId, nodes, edges, flowPath } = req.body;
  try {
    const flow = await Workflows.findByIdAndUpdate(
      flowId,
      {
        nodes,
        edges,
        flowPath,
      },
      { new: true }
    );

    if (!flow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    return res.status(200).json(flow);
  } catch (error) {
    console.error("Error updating workflow:", error);
    return res.status(500).json({ message: "Error updating workflow" });
  }
};

export const onCreateWorkflow = async (req, res) => {
  const { id, name, description } = req.body;

  if (id) {
    try {
      const user_clerk_id = await User.findOne({ clerkId: id }).populate("_id");

      const workflow = await Workflows.create({
        user: user_clerk_id,
        name,
        description,
        nodes:"",
        edges:""
      });

      if (workflow) {
        return res.status(201).json({ message: "Workflow created" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Oops! Try again" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};

export const onFlowPublish = async (req, res) => {
  const { workflowId, state } = req.body;
  try {
    const flow = await Workflows.findByIdAndUpdate(
      workflowId,
      {
        publish: state,
      },
      { new: true }
    );

    if (!flow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    return res.status(200).json(flow);
  } catch (error) {
    console.error("Error updating workflow:", error);
    return res.status(500).json({ message: "Error updating workflow" });
  }
};

export const onGetWorkflows = async (req, res) => {
    const {id} = req.params
  try {
    const user_id = await User.findOne({ clerkId: id }).populate("_id");
    

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workflows = await Workflows.find({ user: user_id });

    if (!workflows || workflows.length === 0) {
      return res.status(404).json({ message: "No workflows found" });
    }

    // Return workflows
    return res.status(200).json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return res.status(500).json({ message: "Error fetching workflows" });
  }
};


export const onGetNodesEdges = async (req, res) => {
  const {id} = req.params
try {

  const workflows = await Workflows.find({ _id: id }).select({
    nodes:1,edges:1
  });

  if (!workflows || workflows.length === 0) {
    return res.status(404).json({ message: "No workflows found" });
  }

  // Return workflows
  return res.status(200).json(workflows);
} catch (error) {
  console.error("Error fetching workflows:", error);
  return res.status(500).json({ message: "Error fetching workflows" });
}
};

/* eslint-disable no-unused-vars */
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { getUserProfile } from '../util/auth';
// import Navigation from '../components/Navigation';

// export default function StacksPage() {

//   const gradientColor = "bg-gradient-to-r from-primary via-purple-500 to-blue-500";

//   const navigate = useNavigate();
//   const [stacks, setStacks] = useState([]);
//   const [form, setForm] = useState({ name: '', description: '' });
//   const [user, setUser] = useState(null);

//   // const handleCreateStack = () => {
//   //   const newStack = { ...form, id: Date.now() };
//   //   setStacks([...stacks, newStack]);
//   //   setForm({ name: '', description: '' });
//   // };

//   useEffect(() => {
//     const fetchStacks = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/workflow", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const data = await res.json();
//         setStacks(data);
//       } catch (err) {
//         console.error("Failed to load stacks", err);
//       }
//     };

//     fetchStacks();
//   }, []);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const data = await getUserProfile();
//       setUser(data);
//     };
//     fetchProfile();
//   }, []);


//   const handleCreateStack = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/workflow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           name: form.name,
//           description: form.description,
//         }),
//       });

//       const newStack = await res.json();
//       setStacks((prev) => [...prev, newStack]);
//       setForm({ name: '', description: '' });
//     } catch (err) {
//       console.error("Failed to create stack", err);
//     }
//   };


//   return (
//     // <div className="min-h-screen bg-gray-50 p-8 ">

//     <div className="min-h-screen bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100  ">

//       <Navigation />

//       <div className="p-4 text-2xl font-bold">
//         Hello, {user?.name || "loading..."} 👋
//       </div>
//       <div className="flex justify-between items-center p-4">
//         <h1 className="text-xl font-semibold">My Stacks</h1>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button
//               // className="bg-green-600 hover:bg-green-700"
//               className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
//             >
//               + New Stack
//             </Button>
//           </DialogTrigger>
//           {/* <DialogContent className="sm:max-w-[425px] bg-white backdrop-blur-sm"> */}
//           <DialogContent className="sm:max-w-[425px] backdrop-blur-sm  bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
//             <DialogHeader>
//               <DialogTitle>Create New Stack</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label htmlFor="name" className="text-right">
//                   Name
//                 </label>
//                 <Input
//                   id="name"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="Chat With PDF"
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label htmlFor="description" className="text-right">
//                   Description
//                 </label>
//                 <Textarea
//                   id="description"
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   placeholder="Chat with your pdf docs"
//                   className="col-span-3"
//                   rows={3}
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end gap-2">
//               <DialogTrigger asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DialogTrigger>
//               <DialogTrigger asChild>
//                 <Button
//                   type="submit"
//                   onClick={handleCreateStack}
//                   // className="bg-blue-600 hover:bg-blue-700"
//                   className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
//                 >
//                   Create
//                 </Button>
//               </DialogTrigger>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {stacks.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-300 rounded-md">
//           <p className="text-lg font-medium mb-2">Create New Stack</p>
//           <p className="text-sm text-gray-500 mb-4">
//             Start building your generative AI apps with essential tools and framworks
//           </p>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button
//                 // className="bg-green-600 hover:bg-green-700"
//                 className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
//               >
//                 + New Stack
//               </Button>
//             </DialogTrigger>
//             {/* <DialogContent className="sm:max-w-[425px] bg-white backdrop-blur-sm "> */}
//             <DialogContent className="sm:max-w-[425px] backdrop-blur-sm  bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
//               <DialogHeader>
//                 <DialogTitle>Create New Stack</DialogTitle>
//               </DialogHeader>
//               <div className="grid gap-4 py-4 ">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <label htmlFor="name" className="text-right">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     placeholder="Chat With PDF"
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <label htmlFor="description" className="text-right">
//                     Description
//                   </label>
//                   <Textarea
//                     id="description"
//                     value={form.description}
//                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                     placeholder="Chat with your pdf docs"
//                     className="col-span-3"
//                     rows={3}
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <DialogTrigger asChild>
//                   <Button variant="outline">Cancel</Button>
//                 </DialogTrigger>
//                 <DialogTrigger asChild>
//                   <Button
//                     type="submit"
//                     onClick={handleCreateStack}
//                     // className="bg-blue-600 hover:bg-blue-700"
//                     className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
//                   >
//                     Create
//                   </Button>
//                 </DialogTrigger>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {Array.isArray(stacks) && stacks.length > 0 ? (
//             // {stacks.map((stack) => (
//             stacks.map((stack) => (
//               <div
//                 key={stack.id}
//                 className="bg-white shadow rounded p-4 flex flex-col justify-between"
//               >
//                 <div>
//                   <h2 className="font-semibold text-lg">{stack.name}</h2>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {stack.description || 'No description'}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => navigate(`/editor/${stack.id}`)}
//                   className="mt-4 text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
//                 >
//                   Edit Stack
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div>No stacks found</div>
//           )
//           }
//         </div>
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, getUserProfile } from '../util/auth';
import Navigation from '../components/Navigation';
import { toast } from "sonner"
import { SquarePen } from 'lucide-react';



export default function StacksPage() {
  const gradientColor = "bg-gradient-to-r from-primary via-purple-500 to-blue-500";
  const navigate = useNavigate();
  const [stacks, setStacks] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // const res = await fetch("http://127.0.0.1:8000/workflow", {
        // const res = await fetch("http://127.0.0.1:8000/api/workflow/get-workflow", {
        const res = await fetch(`${API_BASE_URL}/api/workflow/get-workflow`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setStacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load stacks", err);
        setFetchError(err.message);
        setStacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStacks();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setUser(data);
    };
    fetchProfile();
  }, []);

  const handleCreateStack = async () => {
    try {
      // const res = await fetch("http://127.0.0.1:8000/workflow", {
      // const res = await fetch("http://127.0.0.1:8000/api/workflow", {
      const res = await fetch(`${API_BASE_URL}/api/workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          // components: [] // Add empty array or default components if needed
          // components: {}    // fast api expects input to be dictionary, changed to JSONB object in the controller fucntions/schemas.. hence {} json supports {}
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to create stack');
      }

      const newStack = await res.json();
      setStacks((prev) => [...prev, newStack]);
      setForm({ name: '', description: '' });
      setIsDialogOpen(false);
      toast("Stack created successfully!");

      // Navigate to the editor with the new stack ID
      if (newStack.id) {
        navigate(`/editor/${newStack.id}`);
      } else {
        throw new Error("Created stack but missing ID in response");
      }
    } catch (err) {
      console.error("Failed to create stack", err);
      toast(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
      <Navigation />

      <div className="p-4 text-2xl font-bold">
        Hello, {user?.name || "loading..."} 👋
      </div>

      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">My Stacks</h1>
        {stacks.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}>
                + New Stack
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
              <DialogHeader>
                <DialogTitle>Create New Stack</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Chat With PDF"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Chat with your pdf docs"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateStack}
                  className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {stacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-300 rounded-md">
          <p className="text-lg font-medium mb-2">Create New Stack</p>
          <p className="text-sm text-gray-500 mb-4 text-center px-4">
            Start building your generative AI apps with essential tools and frameworks
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}>
                + New Stack
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
              <DialogHeader>
                <DialogTitle>Create New Stack</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Chat With PDF"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Chat with your pdf docs"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateStack}
                  className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {stacks.map((stack) => (
            <div
              key={stack.id}
              // className="bg-white shadow rounded p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              className="bg-background bg-gradient-to-r from-purple-100 via-purple-100 to-blue-100 shadow rounded p-4 flex flex-col justify-between hover:shadow-md transition-shadow border border-pink-300"
            >
              <div>
                <h2 className="font-semibold text-lg">{stack.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {stack.description || 'No description'}
                </p>
              </div>
              <button
                // onClick={() => navigate(`/editor/${stack.id}`)}
                onClick={() => {
                  if (stack.id) {  // Check if ID exists
                    navigate(`/editor/${stack.id}`);
                  } else {
                    toast("Stack ID is missing");
                  }
                }}
                // className="mt-4 text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
                className=" flex mt-4 ml-60 font-semibold text-xs w-24 bg-pink-200 border px-3 py-1 rounded hover:bg-red-400 gap-0.5"
              >
                Edit Stack <SquarePen className="h-3 w-3 mt-0.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
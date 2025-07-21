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
import { getUserProfile } from '../util/auth';
import Navigation from '../components/Navigation';

export default function StacksPage() {

  const gradientColor = "bg-gradient-to-r from-primary via-purple-500 to-blue-500";

  const navigate = useNavigate();
  const [stacks, setStacks] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [user, setUser] = useState(null);

  const handleCreateStack = () => {
    const newStack = { ...form, id: Date.now() };
    setStacks([...stacks, newStack]);
    setForm({ name: '', description: '' });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setUser(data);
    };
    fetchProfile();
  }, []);

  return (
    // <div className="min-h-screen bg-gray-50 p-8 ">
   

    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100  ">

      <Navigation />

      <div className="p-4 text-2xl font-bold">
        Hello, {user?.name || "loading..."} 👋
      </div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">My Stacks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
            // className="bg-green-600 hover:bg-green-700"
            className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
            >
              + New Stack
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white backdrop-blur-sm">
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
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  onClick={handleCreateStack}
                  // className="bg-blue-600 hover:bg-blue-700"
                  className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
                >
                  Create
                </Button>
              </DialogTrigger>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-300 rounded-md">
          <p className="text-lg font-medium mb-2">Create New Stack</p>
          <p className="text-sm text-gray-500 mb-4">
            Start building your generative AI apps with essential tools and framworks
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
              // className="bg-green-600 hover:bg-green-700"
              className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
              >
                + New Stack
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white backdrop-blur-sm">
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
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button
                    type="submit"
                    onClick={handleCreateStack}
                    // className="bg-blue-600 hover:bg-blue-700"
                    className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}
                  >
                    Create
                  </Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="bg-white shadow rounded p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">{stack.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {stack.description || 'No description'}
                </p>
              </div>
              <button
                onClick={() => navigate(`/editor/${stack.id}`)}
                className="mt-4 text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
              >
                Edit Stack
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
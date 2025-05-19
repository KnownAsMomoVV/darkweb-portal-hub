
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Move } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LayoutEditorProps {
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const useLayoutEditor = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { toast } = useToast();
  
  const toggleEditMode = () => {
    if (isEditing) {
      setIsEditing(false);
      toast({
        title: "Edit mode disabled",
        description: "The layout is now locked"
      });
      return;
    }
    
    setShowPasswordDialog(true);
  };
  
  const handlePasswordSubmit = (password: string) => {
    if (password === "momopc") {
      setIsEditing(true);
      setShowPasswordDialog(false);
      toast({
        title: "Edit mode enabled",
        description: "You can now rearrange the layout"
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  return { 
    isEditing, 
    showPasswordDialog, 
    setShowPasswordDialog, 
    toggleEditMode, 
    handlePasswordSubmit 
  };
};

const LayoutEditor = ({ isEditing, onToggleEdit }: LayoutEditorProps) => {
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { toast } = useToast();
  
  const handlePasswordSubmit = () => {
    if (password === "momopc") {
      setShowPasswordDialog(false);
      onToggleEdit();
      toast({
        title: "Edit mode enabled",
        description: "You can now rearrange the layout"
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className={`fixed bottom-4 right-4 z-50 ${isEditing ? 'bg-primary text-primary-foreground' : ''}`}
        onClick={() => isEditing ? onToggleEdit() : setShowPasswordDialog(true)}
      >
        <Move className="mr-2 h-4 w-4" />
        {isEditing ? "Lock Layout" : "Edit Layout"}
      </Button>
      
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Layout Editor</DialogTitle>
            <DialogDescription>
              Enter password to enable layout editing mode
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Unlock Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LayoutEditor;

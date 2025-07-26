import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

interface LeaveRequestFormProps {
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>) => void;
}

export const LeaveRequestForm = ({ onSubmit }: LeaveRequestFormProps) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeName || !formData.leaveType || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Error", 
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    setFormData({
      employeeName: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: ""
    });

    toast({
      title: "Success",
      description: "Leave request submitted successfully!"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl shadow-[var(--shadow-soft)] border-0 bg-[var(--gradient-card)]">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
          Submit Leave Request
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the form below to request time off
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employeeName" className="text-sm font-medium">
              Employee Name *
            </Label>
            <Input
              id="employeeName"
              value={formData.employeeName}
              onChange={(e) => handleInputChange("employeeName", e.target.value)}
              placeholder="Enter your full name"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveType" className="text-sm font-medium">
              Leave Type *
            </Label>
            <Select value={formData.leaveType} onValueChange={(value) => handleInputChange("leaveType", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="paternity">Paternity Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason (Optional)
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Provide additional details about your leave request..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium bg-[var(--gradient-primary)] hover:opacity-90 shadow-[var(--shadow-medium)] transition-all duration-300"
          >
            Submit Leave Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
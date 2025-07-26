import { useState, useEffect } from "react";
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

  const [isVisible, setIsVisible] = useState(false);
  const [daysDuration, setDaysDuration] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDaysDuration(diffDays);
      } else {
        setDaysDuration(0);
      }
    } else {
      setDaysDuration(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeName || !formData.leaveType || !formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Date Error", 
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.startDate) < new Date()) {
      toast({
        title: "Date Error",
        description: "Start date cannot be in the past.",
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
      title: "Success!",
      description: `Leave request for ${daysDuration} day(s) submitted successfully!`,
      variant: "default"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      <Card className="w-full max-w-2xl shadow-soft border-0 bg-[var(--gradient-card)] hover:shadow-medium transition-all duration-300">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-12 h-12 bg-[var(--gradient-primary)] rounded-xl flex items-center justify-center animate-bounce-gentle">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold font-poppins bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            Submit Leave Request
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Fill out the form below to request time off
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="employeeName" className="text-sm font-medium font-inter">
                Employee Name *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => handleInputChange("employeeName", e.target.value)}
                placeholder="Enter your full name"
                className="h-12 text-base transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Label htmlFor="leaveType" className="text-sm font-medium font-inter">
                Leave Type *
              </Label>
              <Select value={formData.leaveType} onValueChange={(value) => handleInputChange("leaveType", value)}>
                <SelectTrigger className="h-12 text-base transition-all duration-200 focus:shadow-soft">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">🏖️ Vacation</SelectItem>
                  <SelectItem value="sick">🏥 Sick Leave</SelectItem>
                  <SelectItem value="personal">👤 Personal Leave</SelectItem>
                  <SelectItem value="maternity">👶 Maternity Leave</SelectItem>
                  <SelectItem value="paternity">👨‍👶 Paternity Leave</SelectItem>
                  <SelectItem value="emergency">🚨 Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium font-inter">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="h-12 text-base transition-all duration-200 focus:shadow-soft"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium font-inter">
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="h-12 text-base transition-all duration-200 focus:shadow-soft"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {daysDuration > 0 && (
              <div className="animate-scale-in p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary font-inter">
                    Duration: {daysDuration} day{daysDuration > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Label htmlFor="reason" className="text-sm font-medium font-inter">
                Reason (Optional)
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Provide additional details about your leave request..."
                className="min-h-[120px] text-base resize-none transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold font-poppins bg-[var(--gradient-primary)] hover:opacity-90 shadow-medium hover:shadow-large transition-all duration-300 transform hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              Submit Leave Request
              {daysDuration > 0 && (
                <span className="ml-2 text-sm opacity-90">
                  ({daysDuration} day{daysDuration > 1 ? 's' : ''})
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
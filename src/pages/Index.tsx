import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { LeaveRequestList } from "@/components/leave/LeaveRequestList";
import { LeaveDashboard } from "@/components/leave/LeaveDashboard";
import { Calendar, FileText, BarChart3, Settings } from "lucide-react";

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

const Index = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "John Smith",
      leaveType: "vacation",
      startDate: "2024-08-15",
      endDate: "2024-08-20",
      reason: "Family vacation to the beach",
      status: "approved",
      submittedDate: "2024-07-20"
    },
    {
      id: "2", 
      employeeName: "Sarah Johnson",
      leaveType: "sick",
      startDate: "2024-08-10",
      endDate: "2024-08-12",
      reason: "Medical appointment and recovery",
      status: "pending",
      submittedDate: "2024-08-08"
    }
  ]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmitRequest = (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>) => {
    const request: LeaveRequest = {
      ...newRequest,
      id: Date.now().toString(),
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setRequests(prev => [request, ...prev]);
  };

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--gradient-primary)] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                  Leave Management
                </h1>
                <p className="text-sm text-muted-foreground">Manage your time off requests</p>
              </div>
            </div>
            <Button
              variant={isAdmin ? "default" : "outline"}
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {isAdmin ? "Admin Mode" : "Employee Mode"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 h-12">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              All Requests
            </TabsTrigger>
            <TabsTrigger value="submit" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Calendar className="w-4 h-4" />
              Submit Request
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <LeaveDashboard requests={requests} />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Leave Requests</h2>
                <p className="text-muted-foreground">
                  {isAdmin ? "Manage all employee leave requests" : "View your submitted leave requests"}
                </p>
              </div>
            </div>
            <LeaveRequestList 
              requests={requests} 
              onStatusChange={isAdmin ? handleStatusChange : undefined}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="submit" className="flex justify-center">
            <LeaveRequestForm onSubmit={handleSubmitRequest} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Eye, Calendar, User } from "lucide-react";

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

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  onStatusChange?: (id: string, status: 'approved' | 'rejected') => void;
  isAdmin?: boolean;
}

export const LeaveRequestList = ({ requests, onStatusChange, isAdmin = false }: LeaveRequestListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-warning text-warning-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (requests.length === 0) {
    return (
      <Card className="w-full shadow-[var(--shadow-soft)] border-0 bg-[var(--gradient-card)]">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No leave requests found</h3>
          <p className="text-sm text-muted-foreground">Submit your first leave request to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="shadow-[var(--shadow-soft)] border-0 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">{request.employeeName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {formatDate(request.submittedDate)}
                  </p>
                </div>
              </div>
              <Badge className={`${getStatusColor(request.status)} px-3 py-1 flex items-center gap-1.5`}>
                {getStatusIcon(request.status)}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Leave Type</p>
                <p className="font-medium capitalize">{request.leaveType}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {calculateDays(request.startDate, request.endDate)} day(s)
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{request.status}</p>
              </div>
            </div>

            {request.reason && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{request.reason}</p>
              </div>
            )}

            {isAdmin && request.status === 'pending' && onStatusChange && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => onStatusChange(request.id, 'approved')}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(request.id, 'rejected')}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Eye, Calendar, User, TrendingUp } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        return 'bg-[var(--gradient-success)] text-white border-success/20';
      case 'rejected':
        return 'bg-[var(--gradient-destructive)] text-white border-destructive/20';
      default:
        return 'bg-[var(--gradient-warning)] text-warning-foreground border-warning/20';
    }
  };

  const getLeaveTypeEmoji = (leaveType: string) => {
    switch (leaveType) {
      case 'vacation':
        return '🏖️';
      case 'sick':
        return '🏥';
      case 'personal':
        return '👤';
      case 'maternity':
        return '👶';
      case 'paternity':
        return '👨‍👶';
      case 'emergency':
        return '🚨';
      default:
        return '📅';
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
      <div className={`transition-all duration-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <Card className="w-full shadow-soft border-0 bg-[var(--gradient-card)]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-bounce-gentle">
              <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            </div>
            <h3 className="text-xl font-semibold font-poppins text-muted-foreground mb-2">No leave requests found</h3>
            <p className="text-muted-foreground">Submit your first leave request to get started</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      {requests.map((request, index) => (
        <Card 
          key={request.id} 
          className="shadow-soft border-0 bg-[var(--gradient-card)] hover:shadow-large transition-all duration-300 transform hover:scale-[1.02] animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--gradient-primary)] rounded-xl flex items-center justify-center animate-bounce-gentle">
                  <span className="text-xl">{getLeaveTypeEmoji(request.leaveType)}</span>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold font-poppins text-foreground">
                    {request.employeeName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-inter">
                    Submitted on {formatDate(request.submittedDate)}
                  </p>
                </div>
              </div>
              <Badge className={`${getStatusColor(request.status)} px-4 py-2 flex items-center gap-2 shadow-soft border`}>
                {getStatusIcon(request.status)}
                <span className="font-semibold">
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground font-inter uppercase tracking-wide">Leave Type</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getLeaveTypeEmoji(request.leaveType)}</span>
                  <p className="font-semibold capitalize text-foreground font-poppins">{request.leaveType}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground font-inter uppercase tracking-wide">Duration</p>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground font-poppins">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-sm text-primary font-medium">
                      {calculateDays(request.startDate, request.endDate)} day{calculateDays(request.startDate, request.endDate) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground font-inter uppercase tracking-wide">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <p className="font-semibold capitalize text-foreground font-poppins">{request.status}</p>
                </div>
              </div>
            </div>

            {request.reason && (
              <div className="space-y-2 animate-scale-in">
                <p className="text-sm font-semibold text-muted-foreground font-inter uppercase tracking-wide">Reason</p>
                <div className="bg-muted/30 p-4 rounded-xl border border-muted/50">
                  <p className="text-foreground font-inter leading-relaxed">{request.reason}</p>
                </div>
              </div>
            )}

            {isAdmin && request.status === 'pending' && onStatusChange && (
              <div className="flex gap-3 pt-4 border-t border-muted/30 animate-slide-up">
                <Button
                  size="sm"
                  onClick={() => onStatusChange(request.id, 'approved')}
                  className="bg-[var(--gradient-success)] hover:opacity-90 text-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 font-semibold px-6"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Request
                </Button>
                <Button
                  size="sm"
                  onClick={() => onStatusChange(request.id, 'rejected')}
                  className="bg-[var(--gradient-destructive)] hover:opacity-90 text-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 font-semibold px-6"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
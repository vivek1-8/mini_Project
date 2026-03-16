import React, { useEffect, useState } from 'react';
import api from '@/api';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppointmentCard = ({
  appointment: initialAppointment,
  appointmentId,
  viewAs = 'patient',
  onCancel,
  onConfirm,
}) => {
  const [appointment, setAppointment] = useState(initialAppointment || null);
  const [loading, setLoading] = useState(!initialAppointment);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    upcoming: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-accent/10 text-accent border-accent/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAppointment = async () => {
      if (initialAppointment) return;
      if (!appointmentId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/api/appointments/${appointmentId}`);

        if (isMounted) {
          setAppointment(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch appointment', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointment();

    return () => {
      isMounted = false;
    };
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        Loading appointment…
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      const id = appointmentId || appointment.id || appointment._id;
      const res = await api.put(`/api/appointments/${id}/status`, { status: newStatus });
      setAppointment({ ...appointment, status: newStatus });
      if (newStatus === 'confirmed' && onConfirm) onConfirm();
      if (newStatus === 'cancelled' && onCancel) onCancel();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (!appointment) return null;

  return (
    <div className="group rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-md hover:-translate-y-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Video className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">
              {viewAs === 'doctor'
                ? appointment.patientName
                : appointment.doctorName}
            </h4>

            {viewAs === 'patient' && (
              <p className="text-sm text-muted-foreground">
                {appointment.doctorSpecialization}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {appointment.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {appointment.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium capitalize',
              statusColors[appointment.status]
            )}
          >
            {appointment.status}
          </span>

          {['pending', 'upcoming'].includes(appointment.status) && viewAs === 'doctor' && (
            <div className="flex gap-2">
              <Button size="sm" variant="soft" onClick={() => handleStatusUpdate('confirmed')}>
                <CheckCircle className="h-4 w-4" />
                Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate('cancelled')}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          {['pending', 'upcoming'].includes(appointment.status) && viewAs === 'patient' && (
            <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate('cancelled')}>
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}

          {appointment.status === 'confirmed' && (
            <div className="flex gap-2">
              <Button size="sm" variant="soft">
                <Video className="h-4 w-4" />
                Join Call
              </Button>
              {viewAs === 'doctor' && (
                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate('completed')}>
                  <CheckCircle className="h-4 w-4" />
                  Mark Done
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppointmentCard = ({
  appointmentId,
  viewAs = 'patient',
  onCancel,
  onConfirm,
}) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-accent/10 text-accent border-accent/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`/api/appointments/${appointmentId}`);

        // expected API shape:
        // {
        //   id,
        //   patientName,
        //   doctorName,
        //   doctorSpecialization,
        //   date,
        //   time,
        //   status
        // }

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

  if (!appointment) return null;

  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-hover">
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

          {appointment.status === 'pending' && viewAs === 'doctor' && (
            <div className="flex gap-2">
              <Button size="sm" variant="soft" onClick={onConfirm}>
                <CheckCircle className="h-4 w-4" />
                Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          {appointment.status === 'pending' && viewAs === 'patient' && (
            <Button size="sm" variant="ghost" onClick={onCancel}>
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}

          {appointment.status === 'confirmed' && (
            <Button size="sm" variant="soft">
              <Video className="h-4 w-4" />
              Join Call
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;

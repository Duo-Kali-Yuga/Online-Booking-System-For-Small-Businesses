import dayjs from "dayjs";
import { FiTrash2 } from "react-icons/fi";
import { isNew } from "./helpers";
import { useNavigate } from "react-router-dom";

export default function AppointmentCard({
  appt,
  onUpdate,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm design-bg">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold">{appt.client?.name}</p>
          <p className="text-sm text-slate-500">
            {appt.service?.name}
          </p>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            appt.status === "confirmed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {appt.status}
        </span>
      </div>
      <div className="flex justify-between items-start mb-2">
        {/* Date */}
        <div className="text-sm text-slate-600 mb-3">
          <p>{dayjs(appt.date).format("MMM D")}</p>
          <p className="text-blue-600 font-medium">
            {appt.startTime}
          </p>
        </div>

        {/* New badge */}
        {isNew(appt.createdAt) && (
          <div className="text-xs text-blue-500 mb-2 flex items-center gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-ping" />
            New booking
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {appt.status === "pending" && (
          <button
            onClick={() => onUpdate(appt._id, "confirmed")}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs"
          >
            Accept
          </button>
        )}

        <button
          onClick={() => navigate(`/booking/${appt.provider}`)}
          className="border px-3 py-1 rounded text-xs"
        >
          Reschedule
        </button>

        {(appt.status === "confirmed" ||
          appt.status === "cancelled") && (
          <button
            onClick={() => onDelete(appt._id)}
            className="text-red-500 text-sm"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}
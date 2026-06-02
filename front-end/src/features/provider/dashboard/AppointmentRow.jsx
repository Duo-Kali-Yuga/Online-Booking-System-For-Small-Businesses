import dayjs from "dayjs";
import { FiTrash2 } from "react-icons/fi";
import { isNew } from "./helpers";
import { useNavigate } from "react-router-dom";

export default function AppointmentRow({
  appt,
  onUpdate,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* DESKTOP TABLE */}
      <tr className="hidden md:table-row hover:bg-slate-50 transition design-bg overflow-hidden">
        <td className="px-6 py-4 font-bold">
          {appt.client?.name}
        </td>

        <td className="px-6 py-4">
          {appt.service?.name}
        </td>

        <td className="px-6 py-4">
          <div>{dayjs(appt.date).format("MMM D")}</div>
          <div className="text-blue-600 text-xs">
            {appt.startTime}
          </div>
        </td>

        <td className="px-6 py-4 text-right">
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              appt.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {appt.status}
          </span>
        </td>

        <td className="px-6 py-4 flex items-center gap-2">
          {isNew(appt.createdAt) && (
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-ping" />
          )}
          {appt.client?.name}
        </td>

        <td className="px-6 py-4 text-right space-x-2">
          {appt.status === "pending" && (
            <button
              onClick={() => onUpdate(appt._id, "confirmed")}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs"
            >
              Accept
            </button>
          )}

          <button
            onClick={() => navigate(`/provider/booking/${appt._id}`)}
            
            className="border px-3 py-1 rounded text-xs"
          >

            Reschedule
          </button>

          {(appt.status === "confirmed" ||
            appt.status === "cancelled") && (
            <button
              onClick={() => onDelete(appt._id)}
              className="text-red-500"
            >
              <FiTrash2 />
            </button>
          )}
        </td>
      </tr>

      {/* MOBILE CARD */}
      <div className="md:hidden bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-sm">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-bold text-slate-800">
              {appt.client?.name}
            </p>
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

        <div className="flex justify-between items-start mb-2 bg-amber-700">
          {/* Date & Time */}
          <div className="text-sm text-slate-600 mb-3">
            <p>{dayjs(appt.date).format("MMM D")}</p>
            <p className="text-blue-600 font-medium">
              {appt.startTime}
            </p>
          </div>

          {/* New indicator */}
          {isNew(appt.createdAt) && (
            <div className="flex items-center gap-2 text-xs text-blue-500 mb-2">
              <span className="h-2 w-2 bg-blue-500 rounded-full animate-ping" />
              New booking fvvvvrvrvrv
            </div>
          )}
        </div>


        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {appt.status === "pending" && (
            <button
              onClick={() => onUpdate(appt._id, "confirmed")}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs"
            >
              Accept
            </button>
          )}

          <button
            onClick={() => navigate(`/provider/booking/${appt.provider?._id || appt.provider}`)}
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
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}
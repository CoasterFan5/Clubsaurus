-- AlterTable
ALTER TABLE "ClubAttendanceEvent" ADD COLUMN     "eventId" INTEGER;

-- AddForeignKey
ALTER TABLE "ClubAttendanceEvent" ADD CONSTRAINT "ClubAttendanceEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

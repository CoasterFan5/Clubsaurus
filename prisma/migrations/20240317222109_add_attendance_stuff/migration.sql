-- CreateTable
CREATE TABLE "ClubAttendanceEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clubId" INTEGER NOT NULL,

    CONSTRAINT "ClubAttendanceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubAttendanceCheck" (
    "attendanceEventId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ClubAttendanceCheck_pkey" PRIMARY KEY ("clubId","userId","attendanceEventId")
);

-- AddForeignKey
ALTER TABLE "ClubAttendanceEvent" ADD CONSTRAINT "ClubAttendanceEvent_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubAttendanceCheck" ADD CONSTRAINT "ClubAttendanceCheck_attendanceEventId_fkey" FOREIGN KEY ("attendanceEventId") REFERENCES "ClubAttendanceEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubAttendanceCheck" ADD CONSTRAINT "ClubAttendanceCheck_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubAttendanceCheck" ADD CONSTRAINT "ClubAttendanceCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

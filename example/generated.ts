import { relations } from "drizzle-orm";
import {
  moodleAssignment,
  moodleCourse,
  moodlePage,
  moodlePageCourse,
  moodleUserCourse,
  psAssignment,
  psAssignmentType,
  psCourse,
  psUserAssignment,
  psUserCourse,
  psUserMeeting,
  user,
  weightCourse,
  weightCourseAssignmentType,
} from "./index";
export const moodleAssignmentRelations = relations(
  moodleAssignment,
  ({ one, many }) => ({
    moodleCourse: one(moodleCourse, {
      fields: [moodleAssignment.courseId],
      references: [moodleCourse.id],
    }),
  }),
);
export const moodleCourseRelations = relations(
  moodleCourse,
  ({ one, many }) => ({
    moodleAssignment: many(moodleAssignment),
    moodlePageCourse: many(moodlePageCourse),
    moodleUserCourse: many(moodleUserCourse),
  }),
);
export const moodlePageCourseRelations = relations(
  moodlePageCourse,
  ({ one, many }) => ({
    moodleCourse: one(moodleCourse, {
      fields: [moodlePageCourse.courseId],
      references: [moodleCourse.id],
    }),
  }),
);
export const moodleUserCourseRelations = relations(
  moodleUserCourse,
  ({ one, many }) => ({
    moodleCourse: one(moodleCourse, {
      fields: [moodleUserCourse.courseId],
      references: [moodleCourse.id],
    }),
    user: one(user, {
      fields: [moodleUserCourse.userEmail],
      references: [user.email],
    }),
  }),
);
export const psAssignmentRelations = relations(
  psAssignment,
  ({ one, many }) => ({
    psCourse: one(psCourse, {
      fields: [psAssignment.courseName],
      references: [psCourse.name],
    }),
    psAssignmentType: one(psAssignmentType, {
      fields: [psAssignment.courseName, psAssignment.assignmentTypeName],
      references: [psAssignmentType.courseName, psAssignmentType.name],
    }),
    psUserAssignment: many(psUserAssignment),
  }),
);
export const psAssignmentTypeRelations = relations(
  psAssignmentType,
  ({ one, many }) => ({
    psAssignment: many(psAssignment),
    psCourse: one(psCourse, {
      fields: [psAssignmentType.courseName],
      references: [psCourse.name],
    }),
  }),
);
export const psCourseRelations = relations(psCourse, ({ one, many }) => ({
  psAssignment: many(psAssignment),
  psAssignmentType: many(psAssignmentType),
  psUserCourse: many(psUserCourse),
  psUserMeeting: many(psUserMeeting),
}));
export const psUserAssignmentRelations = relations(
  psUserAssignment,
  ({ one, many }) => ({
    user: one(user, {
      fields: [psUserAssignment.userEmail],
      references: [user.email],
    }),
    psAssignment: one(psAssignment, {
      fields: [psUserAssignment.assignmentName, psUserAssignment.courseName],
      references: [psAssignment.name, psAssignment.courseName],
    }),
  }),
);
export const psUserCourseRelations = relations(
  psUserCourse,
  ({ one, many }) => ({
    user: one(user, {
      fields: [psUserCourse.userEmail],
      references: [user.email],
    }),
    psCourse: one(psCourse, {
      fields: [psUserCourse.courseName],
      references: [psCourse.name],
    }),
  }),
);
export const psUserMeetingRelations = relations(
  psUserMeeting,
  ({ one, many }) => ({
    user: one(user, {
      fields: [psUserMeeting.userEmail],
      references: [user.email],
    }),
    psCourse: one(psCourse, {
      fields: [psUserMeeting.courseName],
      references: [psCourse.name],
    }),
  }),
);
export const userRelations = relations(user, ({ one, many }) => ({
  moodleUserCourse: many(moodleUserCourse),
  psUserAssignment: many(psUserAssignment),
  psUserCourse: many(psUserCourse),
  psUserMeeting: many(psUserMeeting),
}));
export const weightCourseRelations = relations(
  weightCourse,
  ({ one, many }) => ({
    weightCourseAssignmentType: many(weightCourseAssignmentType),
  }),
);
export const weightCourseAssignmentTypeRelations = relations(
  weightCourseAssignmentType,
  ({ one, many }) => ({
    weightCourse: one(weightCourse, {
      fields: [weightCourseAssignmentType.courseName],
      references: [weightCourse.name],
    }),
  }),
);

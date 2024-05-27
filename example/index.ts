import {
  type UpdateDeleteAction,
  foreignKey,
  int,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const CASCADE_ALL: {
  onUpdate?: UpdateDeleteAction | undefined;
  onDelete?: UpdateDeleteAction | undefined;
} = {
  onUpdate: "cascade",
  onDelete: "cascade",
};

export const user = sqliteTable("user", {
  email: text("email").notNull().primaryKey(),
  gpa: real("gpa").notNull(),
});

export const psUserCourse = sqliteTable(
  "ps_user_course",
  {
    userEmail: text("user_email")
      .notNull()
      .references(() => user.email, CASCADE_ALL),
    courseName: text("course_name")
      .notNull()
      .references(() => psCourse.name, CASCADE_ALL),

    overallGrade: int("overall_grade"),
    homeworkPasses: int("homework_passes"),
    tardies: int("tardies"),
    absences: int("tardies"),
    onDay: text("on_day"),

    teacher: text("teacher"),
    teacherEmail: text("teacher_email"),
    room: text("room"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userEmail, table.courseName] }),
  }),
);

export const psCourse = sqliteTable("ps_course", {
  name: text("name").notNull().primaryKey(),
});

export const psUserMeeting = sqliteTable(
  "ps_user_meeting",
  {
    userEmail: text("user_email")
      .notNull()
      .references(() => user.email, CASCADE_ALL),
    courseName: text("course_name")
      .notNull()
      .references(() => psCourse.name, CASCADE_ALL),
    startTime: int("start_time", { mode: "timestamp" }).notNull(),
    endTime: int("end_time", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userEmail, table.courseName, table.startTime],
    }),
  }),
);

export const psAssignmentType = sqliteTable(
  "ps_assignment_type",
  {
    courseName: text("course_name")
      .notNull()
      .references(() => psCourse.name, CASCADE_ALL),
    name: text("name").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseName, table.name] }),
  }),
);

export const psUserAssignment = sqliteTable(
  "ps_user_assignment",
  {
    userEmail: text("user_email")
      .notNull()
      .references(() => user.email, CASCADE_ALL),
    assignmentName: text("assignment_name").notNull(),
    courseName: text("course_name").notNull(),
    missing: int("missing", { mode: "boolean" }).notNull(),
    collected: int("collected", { mode: "boolean" }).notNull(),
    scored: real("scored"),
    total: real("total"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userEmail, table.assignmentName, table.courseName],
    }),
    fk: foreignKey({
      columns: [table.assignmentName, table.courseName],
      foreignColumns: [psAssignment.name, psAssignment.courseName],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const psAssignment = sqliteTable(
  "ps_assignment",
  {
    name: text("name").notNull(),
    courseName: text("courseName")
      .notNull()
      .references(() => psCourse.name, CASCADE_ALL),
    assignmentTypeName: text("assignmentTypeName").notNull(),
    description: text("description"),
    duedate: int("duedate", { mode: "timestamp" }).notNull(),
    category: text("category"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.courseName] }),
    fk: foreignKey({
      columns: [table.courseName, table.assignmentTypeName],
      foreignColumns: [psAssignmentType.courseName, psAssignmentType.name],
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  }),
);

export const moodleCourse = sqliteTable("moodle_course", {
  id: text("id").notNull().primaryKey(),
  courseName: text("course_name").notNull(),
});

export const moodleUserCourse = sqliteTable(
  "moodle_user_course",
  {
    courseId: text("course_id")
      .notNull()
      .references(() => moodleCourse.id, CASCADE_ALL),
    userEmail: text("user_email")
      .notNull()
      .references(() => user.email, CASCADE_ALL),
    teacher: text("teacher"),
    zoom: text("zoom"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseId, table.userEmail] }),
  }),
);

export const moodlePage = sqliteTable("moodle_page", {
  url: text("url").notNull().primaryKey(),
  /**
   * Content should be in markdown.
   */
  content: text("contents").notNull(),
});

export const moodlePageCourse = sqliteTable(
  "moodle_page_course",
  {
    url: text("url").notNull(),
    courseId: text("course_id")
      .notNull()
      .references(() => moodleCourse.id, CASCADE_ALL),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.url, table.courseId] }),
  }),
);

export const moodleAssignment = sqliteTable(
  "moodle_assignment",
  {
    name: text("name").notNull(),
    courseId: text("course_id")
      .notNull()
      .references(() => moodleCourse.id, CASCADE_ALL),
    description: text("description"),
    duedate: int("duedate", { mode: "timestamp" }).notNull(),
    category: text("category"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.courseId] }),
  }),
);

export const weightCourse = sqliteTable("weight_course", {
  name: text("name").notNull().primaryKey(),
});

export const weightCourseAssignmentType = sqliteTable(
  "weight_course_assignment_type",
  {
    courseName: text("course_name")
      .notNull()
      .references(() => weightCourse.name, CASCADE_ALL),
    name: text("name").notNull(),
    weight: real("weight").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseName, table.name] }),
  }),
);

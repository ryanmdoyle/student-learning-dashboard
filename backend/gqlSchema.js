const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  
  # # # # # # # # # # # #
  # QUERIES
  # # # # # # # # # # # #
  type Query {
    getUserCurrent: User,
    getUser(userId: ID): User!,
    getUsersAll: [User]!,
    getUsersInstructing: [User],

    getCourse(courseId: ID): Course,
    getCoursesEnrolled(userId: ID): [Course],
    getCourseInstructing(userId: ID!): Course,
    getCoursesInstructing(userId: ID): [Course],
    getCourseOfClass(classId: ID!): Course!,
    getCourseOfPlaylist(playlistId: ID!): Course!,
    getCourseContributors(courseId: ID!): [User],
    
    getClass(classId: ID!): Class,
    getClassesEnrolled(userId: ID): [Class],
    getClassInstructing(classId: ID!): Class,
    getClassesInstructing(userId: ID): [Class],

    getPlaylist(playlistId: ID): Playlist!,

    getRequest(playlistId: ID): Request,
    getRequests: [Request],
    
    getScores(userId: ID): [Score],
    getScoresInstructing(scoredBy: ID): [Score],
    getScoresPending: [Score],
    getScorePendingOfEnrolledPlaylist(playlistId: ID!): Score,
    getScoresForPlaylist(playlistId: ID!): [Score],
    getScoresForClass(classId: ID!): [Score],
    getScoresForEnrolledClass(classId: ID!): [Score],
    
    getTasks(
      userId: ID,
      classId: ID,
      playlistId: ID,
    ): [Task],
    
    getQuizForPlaylist(playlistId: ID!): Quiz,
  }

  # # # # # # # # # # # #
  # MUTATIONS
  # # # # # # # # # # # #
  type Mutation {
    # createUser: User!, currently used for creating account in rest API

    createCourse(
      name: String!,
      enrollId: String,
      subject: String!,
      grade: Int!,
      section: String,
      description: String,
      startDate: String,
      endDate: String,
    ): Course!,

    createClass(
      name: String!,
      course: String!,
      enrollId: [String],
      course: String,
      owner: String,
    ): Class!,

    createPlaylist(
      name: String!,
      subject: String!,
      grade: Int,
      description: String,
      course: String!,
      type: String!,
    ): Playlist!,

    createObjective(
      _id: String,
      name: String!,
      description: String,
      playlist: String,
    ): Objective! ,

    createResource(
      name: String!,
      description: String,
      href: String!,
      type: String!,
      objective: String!
    ) : Resource!,

    createQuiz(
      playlistId: ID!,
      type: String!,
      externalLink: String,
      externalResponsesLink: String,
      possibleScore: Int,
    ): Quiz,

    createScore(
      playlistId: ID!,
      userId: ID,
      score: Int,
      possibleScore: Int,
      timeScored: Date,
    ): Score,

    createTask(
      playlistId: ID,
      classId: ID,
      description: String!,
      type: String!,
    ): Task,

    enroll(enrollId: String!) : Class!,
    removeEnrollment(
      studentId: ID!,
      classId: ID!,
    ): Class,

    createRequest(playlistId: ID!) : Request!,
    approveRequest(requestId: ID!): Request!,
    cancelRequest(requestId: ID!): Request!
    deleteRequest(requestId: ID!): ID!,

    updateResourceOrder(
      objectiveId: String!,
      source: Int!,
      destination: Int!, 
    ): Objective!,

    updateObjectiveOrder(
      playlistId: String!,
      source: Int!,
      destination: Int!,
    ): Playlist!,

    updatePlaylistOrder(
      courseId: String!,
      playlistType: String!,
      source: Int!,
      destination: Int!,
    ): Course!,

    updatePlaylistDescription(
      playlistId: String!,
      description: String!,
    ): Playlist!,

    updateObjective(
      name: String!,
      objectiveId: String!,
      description: String!,
    ): Objective!,

    updateCourse(
      courseId: ID!,
      name: String!,
      subject: String!,
      grade: Int!,
      section: String,
      description: String,
      startDate: String,
      endDate: String,
    ): Course!,

    updateClass(
      classId: ID!,
      name: String,
      courseId: ID!,
    ): Class!,

    updatePlaylist(
      playlistId: ID!,
      name: String!,
      description: String!,
      type: String!,
    ): Playlist!,

    updateResource(
      resourceId: ID!,
      name: String!,
      description: String,
      type: String!,
      href: String!,
    ): Resource!,

    updateQuiz(
      playlistId: ID!,
      type: String!,
      externalLink: String,
      externalResponsesLink: String,
      possibleScore: Int,
    ): Quiz,

    updateScore(
      scoreId: ID!,
      score: Int!,
      possibleScore: Int!,
    ): Score!,

    deletePlaylist(
      playlistId: String!,
    ): Playlist!,

    deleteResource(
      resourceId: ID!,
    ): Resource!, 

    deleteObjective(
      objectiveId: ID!,
    ): Objective!,

    deleteCourse(
      courseId: ID!,
    ): Course!,

    deleteClass(
      classId: ID!,
    ): Class!,
    # deleteStudent removes a student from a teacher/all enrolled classses.  If does NOT delete the USER
    deleteStudent(
      studentId: ID!,
    ): User!,

    deleteScore(
      scoreId: ID!
    ): Score!,

    deleteTask(taskId: ID!): Task!,

    acceptQuizApproval(requestId: ID!): Request!,

    login(authToken: String!): String!,
    logout: String!,
    createAccount(authToken: String!, userType: String!): User!,

    createCourseContributor(
      courseId: ID!,
      contributorEmail: String!,
    ): Course!,
  }

  # # # # # # # # # # # #
  # SUBSCRIPTIONS
  # # # # # # # # # # # #

  type Subscription {
    requestApproved(userId: ID!): Request,
  }

  # # # # # # # # # # # #
  # CUSTOM TYPES
  # # # # # # # # # # # #

  type User {
    _id: ID,
    name: String!,
    firstName: String!,
    lastName: String!,
    picture: String,
    googleId: String!,
    email: String!,
    roles: [String!],
  }

  type Course {
    _id: ID,
    name: String!,
    owner: String!,
    contributors: [User],
    subject: String!,
    section: String,
    grade: Int!,
    description: String,
    startDate: Date,
    endDate: Date,
    playlists: [ Playlist ],
    essentialPlaylists: [ Playlist ],
    corePlaylists: [ Playlist ],
    challengePlaylists: [ Playlist ],
  }

  type Class {
    _id: ID,
    name: String!,
    enrollId: String,
    course: Course!,
    primaryInstructor: User!,
    secondaryInstructors: [User],
    enrolled: [User],
  }

  type Playlist {
    _id: ID,
    name: String,
    subject: String,
    description: String,
    grade: Int,
    type: String,
    course: String,
    objectives: [ Objective ],
  }

  type Objective {
    _id: ID,
    name: String!,
    description: String,
    playlist: String,
    resources: [ Resource ],
  }

  type Resource {
    _id: ID,
    name: String,
    description: String,
    href: String,
    order: Int,
    objective: String,
    type: String,
  }

  type Quiz {
    _id: ID,
    playlist: ID!,
    questions: [Question],
    type: String!,
    externalLink: String,
    externalResponsesLink: String,
    possibleScore: Int,
  }

  type Score {
    _id: ID,
    playlist: Playlist,
    user: User,
    possibleScore: Int,
    score: Int,
    timeCreated: Date,
    timeScored: Date,
    scoredBy: ID,
  }

  type Question {
    _id: ID,
    objective: String,
    text: String,
    responses: [String], 
  }

  type Request {
    _id: ID,
    user: User,
    playlist: Playlist,
    type: String,
    approved: Boolean,
    approvalAccepted: Boolean,
    timeRequested: Date,
    timeApproved: Date,
    timeAccepted: Date,
  }

  type Task {
    _id: ID,
    description: String!,
    user: User!,
    class: Class,
    playlist: Playlist,
    type: String!,
  }
`;


module.exports = typeDefs;
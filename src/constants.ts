export enum Constants {
  TOKEN = "token",
  PASSWORD_KEY = "passwordKey",
  LOADING_MUTATION_TEXT = "Applying changes...",
  FINISHED_MUTATION_TEXT = "Updated",
  ERROR_MUTATION_TEXT = "Failed to apply changes, please try again later",
  NO_HAPPINESS_NUMBER = "You need to select a happiness value to save your entry",
  LEAVE_WITHOUT_SAVING = "Still saving entry, are you sure you want to leave?",
}

export enum QueryKeys {
  FETCH_HAPPINESS = "fetchHappiness",
  FETCH_HAPPINESS_COUNT = "fetchHappinessCount",
  FETCH_COMMENTS = "fetchComments",
  FETCH_USER_GROUPS = "fetchUserGroups",
  FETCH_GROUP_INFO = "fetchGroupInfo",
  FETCH_GROUP_HAPPINESS = "fetchGroupHappiness",
  FETCH_GROUP_HAPPINESS_UNREAD = "fetchGroupHappinessUnread",
  FETCH_JOURNAL = "fetchJournal",
  FETCH_JOURNAL_COUNT = "fetchJournalCount",
  INFINITE = "infiniteQuery",
}

export enum MutationKeys {
  MUTATE_HAPPINESS = "mutateHappiness",
  MUTATE_JOURNAL = "mutateJournal",
  MUTATE_GROUP = "mutateGroup",
  MUTATE_PASSWORD_KEY = "mutatePasswordKey",
  CREATE_ACCOUNT = "createAccount",
  LOG_IN = "logIn",
}

// settings keys according to how they are expected from the backend
export enum SettingKeys {
  NOTIFICATIONS = "notify",
  RECOVERY_PHRASE = "key_recovery_phrase",
}

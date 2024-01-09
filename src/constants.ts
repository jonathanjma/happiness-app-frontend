export enum Constants {
  TOKEN = "token",
  PASSWORD_KEY = "passwordKey",
  LOADING_MUTATION_TEXT = "Applying changes...",
  FINISHED_MUTATION_TEXT = "Updated",
  ERROR_MUTATION_TEXT = "Failed to apply changes, please try again later",
  NO_HAPPINESS_NUMBER = "You need to select a happiness value to save your entry",
}

export enum QueryKeys {
  FETCH_HAPPINESS = "fetchHappiness",
  FETCH_HAPPINESS_COUNT = "fetchHappinessCount",
  FETCH_COMMENTS = "fetchComments",
  FETCH_JOURNAL = "fetchJournal",
  INFINITE = "infiniteQuery"
}

export enum MutationKeys {
  MUTATE_HAPPINESS = "mutateHappiness",
  MUTATE_JOURNAL = "mutateJournal",
  MUTATE_PASSWORD_KEY = "mutatePasswordKey",
}

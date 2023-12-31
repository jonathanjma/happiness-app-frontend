export enum Constants {
  TOKEN = "token",
  LOADING_MUTATION_TEXT = "Applying changes...",
  FINISHED_MUTATION_TEXT = "Updated",
  ERROR_MUTATION_TEXT = "Failed to apply changes, please try again later",
  NO_HAPPINESS_NUMBER = "You need to select a happiness value to save your entry",
}

export enum QueryKeys {
  FETCH_HAPPINESS = "fetchHappiness",
  FETCH_COMMENTS = "fetchComments",
  FETCH_USER_GROUPS = "fetchUserGroups",
  FETCH_GROUP_INFO = "fetchGroupInfo",
  FETCH_GROUP_HAPPINESS = "fetchGroupHappiness",
}

export enum MutationKeys {
  MUTATE_HAPPINESS = "mutateHappiness",
}

export enum Constants {
  TOKEN = "token",
  PASSWORD_KEY = "passwordKey",
  LOADING_MUTATION_TEXT = "Applying changes...",
  FINISHED_MUTATION_TEXT = "Updated",
  ERROR_MUTATION_TEXT = "Failed to apply changes, please try again later",
  NO_HAPPINESS_NUMBER = "You need to select a happiness value to save your entry",
}

export enum QueryKeys {
  FETCH_HAPPINESS = "fetchHappiness"
}

export enum MutationKeys {
  MUTATE_HAPPINESS = "mutateHappiness"
}
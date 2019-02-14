import { initSettings } from "../api/settings";
import { loadDisplaySubscriptions } from "../api/subscriptions";
import { loadHistory } from "../api/history";

initSettings();
loadDisplaySubscriptions();
loadHistory();

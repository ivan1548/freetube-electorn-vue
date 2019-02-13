import { initSettings } from "../api/settings";
import {
  loadDisplaySubscriptions,
  loadSubscriptions
} from "../api/subscriptions";
import { loadHistory } from "../api/history";

initSettings();
loadDisplaySubscriptions();
loadSubscriptions();
loadHistory();

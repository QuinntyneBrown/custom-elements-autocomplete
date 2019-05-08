import "./auto-complete.component";
import "./form-field.component";
import "./search-result-item-detail.component";
import "./search-result-item.component";
import "./search-result-items.component";
import "./header.component";
import "@material/mwc-icon";
import "@material/mwc-formfield";
import "./example.component";

require('file-loader?name=[name].[ext]!../index.html');

async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./service-worker.js');
      } catch (e) {
        console.log('ServiceWorker registration failed. Sorry about that.', e);
      }
    } else {
      console.log('Your browser does not support ServiceWorker.');
    }
  }

  registerSW()
  
class videoACDCplayer extends HTMLElement {

    #variables;

    constructor() {
        super();

        this.#variables = {
            sectionId: this.id,
            enable_time_setting: ( this.dataset.enable_time_setting === 'true' ), 
            start_time_hours: parseInt(this.dataset.start_time_hours, 10),
            start_time_mins: parseInt(this.dataset.start_time_mins, 10),
            end_time_hours: parseInt(this.dataset.end_time_hours, 10),
            end_time_mins: parseInt(this.dataset.end_time_mins, 10),
            start_time_ampm: this.dataset.start_time_ampm,
            end_time_ampm: this.dataset.end_time_ampm
        }


        const self = this;

        if (window.isKioskMode) {
          
          this.checkTimeAndToggleSection();
          
          setInterval(() => {
              self.checkTimeAndToggleSection();
          }, 1000);
        }

    }

    getEasternTime() {
        // Get the current UTC date and time
        const now = new Date();
        // Create a date string in the IANA timezone "America/New_York"
        const estDateString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
        // Parse the EST date string back into a Date object
        const estDate = new Date(estDateString);
        return estDate;
    }

    checkTimeAndToggleSection() {

        const sectionId = this.#variables.sectionId;
    
        // Convert current time to EST, considering EST is UTC-5
        const estTime = this.getEasternTime();
        
        const settings = {
            enable_time_setting: this.#variables.enable_time_setting, 
            start_time_hours: this.#variables.start_time_hours,
            start_time_mins: this.#variables.start_time_mins,
            end_time_hours: this.#variables.end_time_hours,
            end_time_mins: this.#variables.end_time_mins,
            start_time_ampm: this.#variables.start_time_ampm,
            end_time_ampm: this.#variables.end_time_ampm,
        };

        if (!settings.enable_time_setting) {
            document.getElementById(sectionId).classList.remove('unavailable-time');
            return;
        }
    
        let startTime = new Date(estTime);
        let endTime = new Date(estTime);
    
        // Adjust hours for AM/PM
        let startHours = settings.start_time_hours === 12 ? (settings.start_time_ampm === 'am' ? 0 : 12) : (settings.start_time_hours + (settings.start_time_ampm === 'pm' ? 12 : 0));
        let endHours = settings.end_time_hours === 12 ? (settings.end_time_ampm === 'am' ? 0 : 12) : (settings.end_time_hours + (settings.end_time_ampm === 'pm' ? 12 : 0));

    
        startTime.setHours(startHours, settings.start_time_mins, 0);
        endTime.setHours(endHours, settings.end_time_mins, 0);
    
        const section = this;

        // console.log(estTime, startTime, endTime);
        
        // Show or hide section based on time
        if (estTime >= startTime && estTime <= endTime) {
            // console.log("removed");
            section.classList.remove('unavailable-time');
        } else {
            // console.log("added");
            section.classList.add('unavailable-time');
        }
    }
}

customElements.define('video-acdc-section', videoACDCplayer);
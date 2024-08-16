<template>
  <v-container>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="filteredJuniorList"
      :sort-by="[{ key: 'section', order: 'asc' }]"
    >
      <!-- toolbar  -->
      <template v-slot:top>
        <v-menu transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-toolbar flat class="pt-2">
              <v-toolbar-title class="text-h6 font-weight-black" style="color: #2f3f64">
                JUNIOR HIGH SECTION
              </v-toolbar-title>
              
              <v-select
                clearable
                label="Grade Level"
                v-bind="props"
                :items="gradeLevels"
                v-model="selectedGrade"
                variant="solo-filled"
                class="mr-2 m-auto"
              ></v-select>
            </v-toolbar>
          </template>
        </v-menu>
      </template>

      <template v-slot:item="{ item }">
        <tr :key="item.id">
          <td>{{ item.grade_level }}</td>
          <td style="padding: 1rem">{{ item.section }}</td>
          <td>{{ item.adviser.full_name }}</td>
          <td>
            <div class="icon">

              <span @click="openAddDialog(item)" class="add" style="cursor: pointer">
                <v-icon>mdi-plus-circle</v-icon>Add
              </span>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="1000px">
      <v-card>
        <v-card-title style="background-color: var(--dark)">
          <span class="fs-5 fw-bold m-2" style="color: white">VIEW SCHEDULE</span>
        </v-card-title>

        <v-container>
          <!-- <ViewSchedule :section-id="currentItem.section" /> -->
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="viewDialog = false" class="bg-red" color="white">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Dialog -->
    <v-dialog v-model="addDialog" max-width="600px">
      <v-card>
        <v-card-title style="background-color: var(--dark)">
          <span class="fs-5 fw-bold m-2" style="color: white">ADD SCHEDULE</span>
        </v-card-title>
        
        <v-card-text>

          <v-form ref="form">
            <!-- Grade Level -->
             <v-row dense>
              <v-col cols="6">
                <v-select
                  v-model="newItem.grade"
                  :items="gradeLevels"
                  label="Grade Level"
                  class="mr-2 m-auto"
                ></v-select>

              </v-col>
              <v-col cols="6">
                 <!-- Room -->
            <v-text-field
              v-model="newItem.section"
              label="Section"
            ></v-text-field>


              </v-col>
             </v-row>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="addNewSchedule" class="bg-green" color="white">Add</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="addDialog = false" class="bg-red" color="white">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// import ViewSchedule from "./ViewSchedule.vue";
// import api from "../../services/api";
import axios from 'axios';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  components: {
    // ViewSchedule,
  },
  data() {
    return {
      selectedSection : null,
      search: "",
      juniorList: [],
      headers: [
        { title: "Grade", key: "grade_level" },
        { title: "Section", key: "section" },
        { title: "Adviser", key: "adviser_id" },
        { title: "Schedule", align: "center", sortable: false },
      ],
      gradeLevels: [
        { value: "7", title: "Grade 7", text: "Grade 7" },
        { value: "8", title: "Grade 8", text: "Grade 8" },
        { value: "9", title: "Grade 9" },
        { value: "10", title: "Grade 10" },
      ],
      selectedGrade: "",
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      schedtime:[
        "7 AM TO 8 AM",
        "8 AM TO 9 AM",
        "9:30 AM TO 10:30 AM",
        "10:30 AM TO 11:30 AM",
        "1 PM TO 2 PM",
        "2 PM TO 3 PM",
        "3 PM TO 4 PM",
      ],
      juniorSubjects: [
        { id: 1, title: "Mathematics", value: "Mathematics" },
        { id: 2, title: "Science", value: "Science" },
        { id: 3, title: "English", value: "English" },
        { id: 4, title: "Filipino", value: "Filipino" },
        { id: 5, title: "Araling Panlipunan", value: "Araling Panlipunan" },
        {
          id: 6,
          title: "Technology and Livelihood Education (TLE)",
          value: "TLE",
        },
        { id: 7, title: "Chirstian Living", value: "CL" },
        {
          id: 8,
          title: "Physical Education (PE)",
          value: "PE",
        },
      ],
      allFaculty : [],
      facultyName : [],
      viewDialog: false,
      addDialog: false,
      currentItem: {},
      newItem: {
        section: "",
        subject: null,
        grade: "",
        classCode: "",
        day: "",
        time: "",
        room: "",
        faculty: "",
      },
    };
  },
  watch:{
    'newItem.subject'(newSubject) {
      // Filter faculty based on the selected subject
      this.facultyName = this.allFaculty.filter(faculty => faculty.department === newSubject);
    },
  },

  computed: {
    filteredJuniorList() {
      if (!Array.isArray(this.juniorList)) {
        console.error("juniorList is not an array");
        return [];
      }
      if (!this.selectedGrade) {
        return this.juniorList;
      }
      return this.juniorList.filter((item) => item.grade_level === this.selectedGrade);
    }
  },
  mounted(){
    this.getSched();
    this.getFaculty();
  },
  // Disable to test the static data
  //   mounted(){
  //   this.getJuniorData();
  //   },

  methods: {
    async getSched(){
      try{
        const res = await axios.get('getSec');
        const data = res.data.data
        this.juniorList = data.filter((item) => item.grade_level < 11 && item.grade_level > 6);
      } catch(error){
        console.error("Error fetching items:", error);
      }
    },
    async getFaculty(){
      const res = await axios.get('faculty');
      this.allFaculty  = res.data.faculty.map((faculty)=>({
        title: `${faculty.fname} ${faculty.mname} ${faculty.lname} ${faculty.extension}`,
        value: faculty.id,
        department: faculty.department
      }));
      console.log(this.facultyName);
    },
    resetGrade() {
      this.selectedGrade = ""; // Reset selectedGrade to clear the v-select
    },


    openAddDialog(item) {
      console.log(item);
      this.newItem.grade = item.grade_level
      this.newItem.section = item.section

      
      this.addDialog = true;
      
    },
    
    addNewSchedule() {
      console.log(this.newItem.subject);
      if (
        this.newItem.subject &&
        this.newItem.grade &&
        this.newItem.time &&
        this.newItem.room &&
        this.newItem.faculty
      ) {
      let dt = {
        grade_level: this.newItem.grade,
        section: this.newItem.section,
        adviser_id:this.newItem.faculty,
        time:  this.newItem.time,
        day:  "Weekdays"
      }
        axios.post('createSched', dt).then(res=>{
          if(res){
            console.log(res);
            this.newItem = {
              subject: null,
              classCode: "",
              day: "",
              time: "",
              room: "",
              faculty: "",
            };
            Swal.fire({
              icon: "success",
              title: "Schedule Added",
              text: "The new schedule has been added successfully!",
            });
          }

        }).catch(error =>{
          console.log(error.response);
          let err = error.response.data;
          this.newItem = {
              subject: null,
              classCode: "",
              day: "",
              time: "",
              room: "",
              faculty: "",
            };
          Swal.fire({
            icon: "error",
            title: err.Message ,
            text:`${err.status} ${error.response.statusText}`,
          });
        })
        this.addDialog = false;

      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please fill out all fields before adding a new schedule.",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-data-table {
  height: 100%;
  .v-table__wrapper {
    padding: 1.5rem;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .v-data-table__th {
      font-size: 17px;
      font-weight: 800;
      text-align: center;
      color: white;
      padding: 1rem;
    }

    .v-data-table__td {
      text-align: center;
      padding: 1rem;
    }
  }

  .icon {
    text-align: center;
    display: flex;
    justify-content: center;
    margin: 0.5rem;

    .view {
      display: flex;
      gap: 0.3rem;
      align-items: center;
      color: white;
      background-color: var(--dark);
      padding: 0.5rem;
      border-radius: 5px;
    }

    .add {
      display: flex;
      gap: 0.3rem;
      align-items: center;
      color: white;
      background-color: green;
      margin-left: 1rem;
      padding: 0.5rem;
      border-radius: 5px;
    }

    .add:hover {
      background-color: darkgreen;
    }
  }
}

.v-toolbar {  
  // background-color: #007bff;
  color: white;

  .v-select {
    color: white;
    border-color: white;

    .v-input__control {
      color: white;

      .v-input__slot {
        color: white;
      }
    }
  }

  .v-btn {
    color: white;
  }

}

.v-dialog {
  .v-card {
    border-radius: 10px;
  }
}

.v-card-title {
  background-color: #007bff;
  color: white;
  padding: 1rem;
}

.v-card-actions {
  padding: 1rem;

  .v-btn {
    color: #007bff;
  }
}
</style>

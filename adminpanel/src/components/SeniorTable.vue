<template>
  <v-container>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="filteredSeniorList"
    :sort-by="[{ key: 'section', order: 'asc' }]"
  >
    <!-- toolbar  -->
    <template v-slot:top>
      <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-toolbar flat class="pt-2">
            <v-toolbar-title class="text-h6 font-weight-black" style="color: #2f3f64">
              SENIOR HIGH SECTION
            </v-toolbar-title>
            
            <v-select
              clearable
              label="Strand"
              v-bind="props"
              :items="strandLevels"
              v-model="selectedStrand"
              variant="solo-filled"
              class="mr-2 m-auto"
            ></v-select>
          </v-toolbar>
        </template>
      </v-menu>
    </template>

    <template v-slot:item="{ item }">
      <tr :key="item.senior_id">
        <td>{{ item.strand }}</td>
        <td style="padding: 1rem">{{ item.section }}</td>
        <td>{{ item.adviser.full_name }}</td>
        <td>
          <div class="icon">
            <span @click="openAddDialog(item)" class="add"><v-icon>mdi-plus-circle</v-icon>Add</span>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>

  <!-- View Schedule Dialog -->
  <v-dialog v-model="viewDialog" max-width="1000px">
    <v-card>
      <v-card-title style="background-color: var(--dark)">
        <span class="fs-5 fw-bold m-2" style="color: white">VIEW SCHEDULE</span>
      </v-card-title>
      <v-container>
        <!-- <ViewScheduleSHS /> -->
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="viewDialog = false" class="bg-red" color="white">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add Schedule Dialog -->
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

            <!-- Room -->
            <!-- <v-text-field
              v-model="newItem.room "
              label="Room"
              required
            ></v-text-field> -->

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
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
// import ViewScheduleSHS from "./ViewScheduleSHS.vue";
import axios from 'axios';

export default {
  components: {
    // ViewScheduleSHS,
  },
  data() {
    return {
      search: "",
      seniorList: [],
      headers: [
        { title: "Strand", key: "strand" },
        { title: "Section", key: "section" },
        { title: "Adviser", key: "adviser" },
        { title: "Action", align: "center", sortable: false },
      ],
      strandLevels: [
        { value: "GAS", title: "GAS" },
        { value: "ABM", title: "ABM" },
        { value: "HE", title: "HE" },
        { value: "HUMSS", title: "HUMSS" },
        { value: "STEM", title: "STEM" },
      ],
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
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
      facultyName: [],
      allFaculty: [],
      schedtime:[
        "7 AM TO 8 AM",
        "8 AM TO 9 AM",
        "9:30 AM TO 10:30 AM",
        "10:30 AM TO 11:30 AM",
        "1 PM TO 2 PM",
        "2 PM TO 3 PM",
        "3 PM TO 4 PM",
      ],
      viewDialog: false,
      addDialog: false,
      selectedStrand: "",
      newItem: {
        strand: "",
        classCode: "",
        day: "",
        time: "",
        room: "",
        faculty: ""
      }
    };
  },
  watch:{
    'newItem.subject'(newSubject) {
      // Filter faculty based on the selected subject
      this.facultyName = this.allFaculty.filter(faculty => faculty.department === newSubject);
    },
  },
  mounted(){
    this.getSched();
    this.getFaculty();
  },

  computed: {
    filteredSeniorList() {
      console.log("Selected strand:", this.selectedStrand);
      console.log(
        "Senior List strands:",
        this.seniorList.map((item) => item.strand)
      );
      if (!Array.isArray(this.seniorList)) {
        console.error("SeniorList is not an array");
        return [];
      }
      if (!this.selectedStrand) {
        return this.seniorList;
      }
      return this.seniorList.filter(
        (item) => item.strand === this.selectedStrand
      );
    },
  },

  methods: {
    async getSched(){
      try{
        const res = await axios.get('getSec');
        const data = res.data.data
        this.seniorList = data.filter((item) => item.grade_level > 10 && item.grade_level < 13);
        let hi = [];
        Object.keys(data).filter(j =>{
          hi.push(data[j].adviser.full_name);
        });
        this.faculty = hi;
        console.log(this.faculty);
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
  .v-table__wrapper {
    padding: 1.5rem;

    .v-data-table__th {
      font-size: 17px;
      font-weight: 800;
      text-align: center;
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
      margin-right: 1rem;
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
      padding: 0.5rem;
      border-radius: 5px;
    }
  }
}
</style>

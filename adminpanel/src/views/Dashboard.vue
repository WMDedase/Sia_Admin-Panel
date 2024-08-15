<script setup>
import { ref, onMounted } from 'vue';
import { fetchCurrentUser } from '../services/api';

const currentUser = ref(null);
const loading = ref(true);
const error = ref(null);
const guidanceStatus = ref('Not Cleared');
const clinicStatus = ref('Not Cleared');
const libraryStatus = ref('Not Cleared');
const inventoryStatus = ref(null);  // Initialize without a default status

// Registrar requirements statuses
const psaStatus = ref('Pending');
const goodMoralStatus = ref('Pending');
const torStatus = ref('Pending');

onMounted(async () => {
  try {
    const response = await fetchCurrentUser();
    console.log('API response:', response);

    if (response.student_profile) {
      currentUser.value = response.student_profile;

      // Set the statuses for PSA, Good Moral, and TOR
      psaStatus.value = response.student_profile.psa || 'Pending';
      goodMoralStatus.value = response.student_profile.goodmoral || 'Pending';
      torStatus.value = response.student_profile.tor || 'Pending';

      // Guidance status logic
      if (!response.student_profile.guidance || response.student_profile.guidance.length === 0) {
        guidanceStatus.value = 'Cleared';
      } else {
        guidanceStatus.value = response.student_profile.guidance.case_status === 1 ? 'Cleared' : 'Not Cleared';
      }

      // Clinic status logic
      if (response.student_profile.physical_exam && Object.keys(response.student_profile.physical_exam).length > 0) {
        clinicStatus.value = 'Cleared';
      } else {
        clinicStatus.value = 'Not Cleared';
      }

      // Library status logic
      if (response.student_profile.library && response.student_profile.library.status) {
        libraryStatus.value = response.student_profile.library.status;
      } else {
        libraryStatus.value = 'Not Cleared';
      }

      // Inventory status logic
      if (response.student_profile.inventory && response.student_profile.inventory.length > 0) {
        inventoryStatus.value = 'Not Cleared'; // Set status to 'Cleared' if there are inventory records
      } else {
        inventoryStatus.value = 'Cleared'; // Set status to 'Not Cleared' if no records are found
      }

      console.log('Current user data:', currentUser.value);
    } else {
      error.value = 'No student data found';
      guidanceStatus.value = 'Cleared';
      clinicStatus.value = 'Not Cleared';
      libraryStatus.value = 'Not Cleared';
      inventoryStatus.value = 'Not Cleared';
    }
  } catch (err) {
    error.value = 'Failed to fetch current user';
    console.error('Error:', err);
    guidanceStatus.value = 'Cleared';
    clinicStatus.value = 'Not Cleared';
    libraryStatus.value = 'Not Cleared';
    inventoryStatus.value = 'Not Cleared';
  } finally {
    loading.value = false;
  }
});
</script>


<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title">DASHBOARD</h1>
      <div class="studentProfile">
        <span class="material-icons">grid_view</span>
        <span class="text fw-bolder">Dashboard</span>
      </div>
    </div>
    <hr>

    <div class="bottom-container">
      <div class="left-container">
        <div class="top-left">
          <h3><span class="material-icons">pending_actions</span>Clearance Status Overview</h3>
          <table class="table table-bordered">
            <thead class="table-label">
              <tr>
                <th>Clearance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="currentUser">
                <td>Clinic</td>
                <td :style="{ color: clinicStatus === 'Cleared' ? 'green' : '#dbc501' }">
                  {{ clinicStatus }}
                </td>
              </tr>
              <tr v-if="currentUser">
                <td>Guidance</td>
                <td :style="{ color: guidanceStatus === 'Cleared' ? 'green' : '#dbc501' }">
                  {{ guidanceStatus }}
                </td>
              </tr>
              <tr v-if="currentUser">
                <td>Inventory</td>
                <td :style="{ color: inventoryStatus === 'Cleared' ? 'green' : '#dbc501' }">
                  {{ inventoryStatus }}
                </td>
              </tr>
              <tr v-if="currentUser">
                <td>Library</td>
                <td :style="{ color:  libraryStatus === 'Cleared' ? 'green' : '#dbc501' }">
                  {{ libraryStatus }}
                </td>
              </tr>
              <tr>
                <td>Registrar</td>
                <template v-if="psaStatus === 'Cleared' && goodMoralStatus === 'Cleared' && torStatus === 'Cleared'">
                  <td style="color: green;">Cleared</td>
                </template>
                <template v-else>
                  <td class="requirements">
                    <thead>
                      <tr class="table-head">
                        <th>Requirement</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PSA/Birth Certificate</td>
                        <td :style="{ color: psaStatus === 'Cleared' ? 'green' : '#FFA500' }">
                          {{ psaStatus }}
                        </td>
                      </tr>
                      <tr>
                        <td>Good Moral</td>
                        <td :style="{ color: goodMoralStatus === 'Cleared' ? 'green' : '#FFA500' }">
                          {{ goodMoralStatus }}
                        </td>
                      </tr>
                      <tr>
                        <td>Form-137/A</td>
                        <td :style="{ color: torStatus === 'Cleared' ? 'green' : '#FFA500' }">
                          {{ torStatus }}
                        </td>
                      </tr>
                    </tbody>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bottom-left">
          <h3><span class="material-icons">info</span>Status Description</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Clearance Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="color: green;" class="fw-bold">Cleared</td>
                <td>All requirements have been successfully fulfilled, and the clearance process is complete.</td>
              </tr>
              <tr>
                <td style="color: #dbc501;" class="fw-bold">Not Cleared</td>
                <td>The clearance process is ongoing. Approval or completion of remaining tasks is required. Students need to address these by accessing respective tabs to view and fulfill the necessary requirements.</td>
              </tr>
              <tr>
                <td style="color: #FFA500;" class="fw-bold">Pending</td>
                <td>Clearance is still in progress. Please check the relevant sections to complete any outstanding tasks and obtain necessary approvals. Ensure all requirements are fulfilled to move forward.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="right-container">
        <div class="vmg">
          <h4>St. Nicholas Academy of Castillejos</h4>
          <h5>MISSION - VISION - GOALS</h5>
          <VMG />
        </div>
      </div>
    </div>
  </main>
</template>


<script>

export default {
  components: {

  }
};
</script>
<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
}

.top-container {
  display: flex;
  margin: 0.5rem;

  .bg-title {
    z-index: -1;
    position: absolute;
    opacity: 6%;
    margin-top: -40px;
    font-size: 100px;
    font-family: Impact, fantasy;
  }

  .studentProfile {
    flex: 1;

    .material-icons {
      position: relative;
      color: var(--dark);
      font-size: 2rem;
      top: 4px;
    }

    .text {
      position: relative;
      color: var(--dark);
      font-size: 2.2rem;
      font-weight: 900;
      bottom: 0.1rem;
      left: 0.2rem;
      text-shadow: 0 1px 1px;
    }
  }
}

.bottom-container {
  display: flex;
  gap: 0.5rem;
  .left-container {
    flex: 0.5;
    margin-right: 1rem;
    margin-bottom: 2em;

    .top-left {
      padding: 1rem;
      margin-bottom: 2rem;
      color: var(--dark);
      border-radius: 5px;
      border-left: 4px solid var(--dark-alt);
      box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;

      h3 {
        text-shadow: 0 0 1px;
        font-size: 20px;
        position: relative;
        bottom: 15px;
      }

      .material-icons {
        position: relative;
        font-size: 35px;
        top: 12px;
        right: 2px;
      }

      table {
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px;
        border: 0.5px solid rgb(228, 228, 228);
        width: 100%;
      }

      th {
        color: var(--dark);
        font-size: 18px;
        text-align: center;
        text-shadow: 0 0 1px;
      }

      td {
        color: var(--dark);
        font-weight: 600;
        padding: 0.6rem 0.3rem;
        text-align: center;
      }

      .requirements {
        font-size: 14px;
        
        display: flex;
        flex-direction: column;
        align-items: center;

        .table-head{
          display: flex;
          gap: 1.7rem
        }
      }

      .center-text {
        text-align: center;
      }
    }

    .bottom-left {
      padding: 1rem;
      margin-bottom: 2rem;
      color: var(--dark);
      border-radius: 5px;
      border-left: 4px solid var(--dark-alt);
      box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;

      h3 {
        text-shadow: 0 0 1px;
        font-size: 20px;
        position: relative;
        bottom: 15px;
      }

      .material-icons {
        position: relative;
        font-size: 35px;
        top: 12px;
        right: 2px;
      }

      table {
        width: 100%;
      }

      th {
        color: var(--dark);
        font-size: 18px;
        text-align: center;
        text-shadow: 0 0 1px;
      }

      td {
        color: var(--dark);
        font-weight: 600;
        padding: 0.6rem 0.3rem;
        text-align: left;
      }
    }
  }

  .right-container {
    flex: 0.5;
    margin-left: 1rem;

    .vmg {
      padding: 1rem;
      margin-bottom: 2rem;
      color: var(--dark);
      border-radius: 5px;
      border-right: 4px solid var(--dark-alt);
      box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;

      h4 {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 24px;
        font-weight: 900;
        text-align: center;
        text-shadow: 0 0 1px;
      }

      h5 {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 900;
        text-align: center;
        text-shadow: 0 0 1px;
      }
    }
  }
}
</style>


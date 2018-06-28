$(document).ready(()=>{

  // function to delete record
  $('.deleteUser').on('click',deleteUser);
  function deleteUser(){
    var confirmation = confirm('Are you sure?');
    if (confirmation){
      $.ajax({
        type : "DELETE",
        url : 'student/delete/' + $(this).data('id'),
        success : (res)=>{
          window.location.replace('/');
        }
      });
      window.location.replace('/');
    }else{
      return false;
    }
  }
// Populating the record for editing
  $('.editUser').on('click',editUser);
  function editUser(){
      $.get('student/edit/' + $(this).data('id'),(data,status)=>{
        var selectedStudent = data.find((obj)=>{return obj._id === $(this).data('id');});
        $('#fname').val(selectedStudent.fname);
        $('#lname').val(selectedStudent.lname);
        $('#editid').val($(this).data('id'));
      });
      //window.location.replace('/');
  }

  /*$('.editUser').on('click',editUser);
  function editUser(){
      $.get('student/edit/' + $(this).data('id'),(data,status)=>{
        var selectedStudent = data.find((obj)=>{return obj._id === $(this).data('id');});
        $('#fname').val(selectedStudent.fname);
        $('#lname').val(selectedStudent.lname);

      });
      //window.location.replace('/');
  }*/
});

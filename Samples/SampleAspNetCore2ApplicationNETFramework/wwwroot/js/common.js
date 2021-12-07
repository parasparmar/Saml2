$(document).ready(function(){

  $('.accordion-button').click(function(){
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
  });

  $('#show-sidebar').on('click', function () {
      $('#sidebar-menu').toggleClass('active-menu');
  });

  function changeLanguage(rtlLang) {
    if (rtlLang == 'AR') {
      var linkStr;
      $("head link").each(function (index) {
          linkStr = $(this).attr('href');
          linkStr = linkStr.replace(/\.css$/, '-rtl.css');
          $(this).attr('href', linkStr);
      });
    }
    else {
      $("head link").each(function (index) {
          linkStr = $(this).attr('href');
          linkStr = linkStr.replace(/\-rtl.css$/, '.css');
          $(this).attr('href', linkStr);
      });
    }
  }

  changeLanguage($("#langChanger").val());

  $("#langChanger").change(function () {
      alert($(this).val());
      changeLanguage(this.value);
  });

  $("select").select2({
    minimumResultsForSearch: -1
  });

  $("select.search2").select2();

  $(".applyDataTable").DataTable({
    responsive: true,
    //select: true,
    scrollX: true,
    dom: '<"d-block"R><"dTbl-top"<"dTbl-center1-col"l><"dTbl-left-col"B><"dTbl-right-col"f>>rtip',
    //dom: 'Rlfrtip',
    lengthChange: true,
    buttons: [
      'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    pagingType: $(window).width() < 768 ? "simple" : "simple_numbers",
    initComplete: function() {
      $('.buttons-copy').html('<i class="fal fa-copy" />').attr('title', 'COPY')
      $('.buttons-csv').html('<i class="fal fa-file-csv" />').attr('title', 'CSV')
      $('.buttons-excel').html('<i class="far fa-file-excel" />').attr('title', 'EXCEL')
      $('.buttons-pdf').html('<i class="fal fa-file-pdf" />').attr('title', 'PDF')
      $('.buttons-print').html('<i class="fal fa-print" />').attr('title', 'Print')
    }
  });

  $(".applyDataTableHscroll").DataTable({
    scrollY: '50vh',
    scrollCollapse: true,
    pagingType: $(window).width() < 768 ? "simple" : "simple_numbers",
    responsive: true,
    scrollX: true,
    dom: '<"d-block"R><"dTbl-top"<"dTbl-center1-col"l><"dTbl-left-col"B><"dTbl-right-col"f>>rtip',
    lengthChange: true,
    buttons: [
    'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    pagingType: $(window).width() < 768 ? "simple" : "simple_numbers",
    initComplete: function() {
    $('.buttons-copy').html('<i class="fal fa-copy" />').attr('title', 'COPY')
    $('.buttons-csv').html('<i class="fal fa-file-csv" />').attr('title', 'CSV')
    $('.buttons-excel').html('<i class="far fa-file-excel" />').attr('title', 'EXCEL')
    $('.buttons-pdf').html('<i class="fal fa-file-pdf" />').attr('title', 'PDF')
    $('.buttons-print').html('<i class="fal fa-print" />').attr('title', 'Print')
    }
  });

  $('.modal').on('shown.bs.modal', function () {
    setTimeout(function () {
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    }, 1);
  });

  //table.buttons().container().appendTo( $('div.eight.column:eq(0)', table.table().container()));

  $(".floating-label").each(function() {

    $(this).find("input").keyup(function() {
      if (!$(this).is('[readonly]')) {
        $(this).prev().addClass("show-it");
      }
    });

    $(document).on("keyup", function(e) {
      if (e.key == "Escape") {
        $(".floating-label").find("a").removeClass("show-it");
        $(".floating-label").find("input").blur()
      }
    });

    $(this).find("input").focus(function(){
      $(".floating-label").find("a").removeClass("show-it");
      if (!$(this).is('[readonly]')) {
        if(!$(this).val()){
            $(this).prev().addClass("show-it");
        }
        else{
            $(this).prev().addClass("show-it");
        }
      }
    });

    $(this).find("input").blur(function(){
      if (!$(this).is('[readonly]')) {
        if(!$(this).val()){
            $(this).prev().removeClass("show-it");
        }
      }
    });

    $(this).find("textarea").focus(function(){
      if (!$(this).is('[readonly]')) {
        if(!$(this).val()){
            $(this).prev().addClass("show-it");
        }
        else{
            $(this).prev().addClass("show-it");
        }
      }
    });

    $(this).find("textarea").blur(function(){
      if (!$(this).is('[readonly]')) {
        if(!$(this).val()){
            $(this).prev().removeClass("show-it");
        }
      }
    });

    $(this).find("a").click(function(){
        $(this).next().val("").focus();
        $(this).toggleClass("show-it");
    });

  });

});

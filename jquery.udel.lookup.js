// 
// UDel lookup plugin
//
// This plugin takes this:
//
// <a class="udelLookup" href="#" title="Person Lookup" lookupGroup="allPeople" 
//  lookupPopulate="emplid:${emplid}" lookupSkipEntry="true">(lookup)</a>
//
// and after this:
//
// $(".udelLookup").udelLookup();
//
// make it operate like this:
//
// <a href="#"  title="Person Lookup" onclick="var win = window.open('https://somewhere.com/lookups/lookup.action?group=allPeople&populate=emplid%3A%7B%7Bemplid%7D%7D&title=Person+Lookup&skipEntry=true','lookup','width=650,height=350,scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes');if(window.focus) {win.focus()};return false;">
//
//
// Setting $.fn.udelLookup.lookupsUrl after loading this file will save a lot of typing in 'lookupsUrl's!
//
// Using the LookupJsTag makes it even easier! 
//
$(function() {
	$.fn.udelLookup = function() {
		$this = $(this);
		var urlArgs = $.param({
			title: $this.attr("title"),
			group: $this.attr("lookupGroup"),
			populate: $this.attr("lookupPopulate"),
			skipEntry: $this.attr("lookupSkipEntry"),
			search: $this.attr("lookupSearch"),
			sortOn: $this.attr("lookupsSortOn"),
			constraints: $this.attr("lookupsConstraints"),
			rowsPerPage: $this.attr("lookupsRowsPerPage"),
			rowDisplay: $this.attr("lookupsRowDisplay"),
			directions: $this.attr("lookupsDirections")
		});
		var url = $this.attr("lookupUrl");
		if (!url) {
			url = this.lookupsUrl ? this.lookupsUrl : $.fn.udelLookup.lookupsUrl;
		}
		url = url.concat("?", urlArgs);
		return $this.click(function() {
			var win = window.open(url, 'lookup', 'width=650,height=350,scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes');
			if(window.focus) {
				win.focus();
			};
			return false;
		});
	};
});

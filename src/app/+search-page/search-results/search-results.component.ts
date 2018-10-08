import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SearchOptions } from '../search-options.model';
import { SearchResult } from '../search-result.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { ViewMode } from '../../core/shared/view-mode.model';
import { hasValue } from '../../shared/empty.util';

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})

/**
 * Component that represents all results from a search
 */
export class SearchResultsComponent {
  /**
   * The actual search result objects
   */
  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: SearchOptions;

  /**
   * The current view mode for the search results
   */
  @Input() viewMode: ViewMode;

  constructor(private router: Router) { }

  /**
   * Method to change the current query by surrounding it by quotes if not already present
   */
  reloadQuery(event: Event) {
    console.log('foo');
    event.preventDefault();

    let newQuery;
    if (this.searchConfig) {
      newQuery = this.searchConfig.query;
    }

    if (hasValue(newQuery) && !(newQuery.startsWith('\"') && newQuery.endsWith('\"'))) {
      newQuery = `"${newQuery}"`;
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        query: newQuery
      },
      queryParamsHandling: 'merge'
    };
    this.router.navigate(['/search'], navigationExtras);
  }

}

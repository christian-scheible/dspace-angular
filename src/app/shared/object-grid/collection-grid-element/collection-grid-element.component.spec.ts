import { CollectionGridElementComponent } from './collection-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Collection } from '../../../core/shared/collection.model';

let collectionGridElementComponent: CollectionGridElementComponent;
let fixture: ComponentFixture<CollectionGridElementComponent>;

const mockCollectionWithAbstract: Collection = Object.assign(new Collection(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    }]
});

const mockCollectionWithoutAbstract: Collection = Object.assign(new Collection(), {
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Test title'
    }]
});

describe('CollectionGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionGridElementComponent ],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract)}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(CollectionGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectionGridElementComponent);
    collectionGridElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionGridElementComponent.object = mockCollectionWithAbstract;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionGridElementComponent.object = mockCollectionWithoutAbstract;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });
});

/*
 * adapt-gmcq
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Amruta Thakur <amruta.thakur@exultcorp.com>
 */
define(function(require) {
    var Mcq = require('components/adapt-contrib-mcq/js/adapt-contrib-mcq');
    var Adapt = require('coreJS/adapt');

    var GMcq = Mcq.extend({

        events: function() {


            var events = {
                'focus .gMcq-item input': 'onItemFocus',
                'blur .gMcq-item input': 'onItemBlur',
                'change .gMcq-item input': 'onItemSelected',
                'keyup .gMcq-item input':'onKeyPress'
            };

            if ($('html').hasClass('ie8')) {

                var ie8Events = {
                    'click label img': 'forceChangeEvent'
                };

                events = _.extend(events, ie8Events);

            }

            return events;

        },

        onItemSelected: function(event) {

            var selectedItemObject = this.model.get('_items')[$(event.currentTarget).parent('.gMcq-item').index()];

            if (this.model.get('_isEnabled') && !this.model.get('_isSubmitted')) {
                this.toggleItemSelected(selectedItemObject, event);
            }

        },

        setupQuestion: function() {
            // Radio button or checkbox
            //this.listenTo(Adapt, 'device:changed', this.reRender, this);
            this.model.set("_isRadio", (this.model.get("_selectable") == 1) );
            this.listenTo(Adapt, 'device:changed', this.resizeImage, this);




        },

        onQuestionRendered: function() {

            this.resizeImage(Adapt.device.screenSize);

            this.$('label').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));

        },

        resizeImage: function(width) {
            this.reRender();
            var imageWidth = width === 'medium' ? 'small' : width;

            this.$('label').each(function(index) {
                var src = $(this).find('img').attr('data-' + imageWidth);
                $(this).find('img').attr('src', src);
            });

        },

        forceChangeEvent: function(event) {

            $("#" + $(event.currentTarget).closest("label").attr("for")).change();

        },

        reRender:function(){
            //alert(Adapt.device.screenSize);
            if (this.model.get('_wasHotSpot') && Adapt.device.screenSize == 'large') {

                this.replaceWithHotSpot();
            }
        },
        replaceWithHotSpot: function() {
            if (!Adapt.componentStore.hotSpot) throw "HotSpot not included in build";
            var HotSpot = Adapt.componentStore.hotSpot;

            var model = this.prepareHotSpotModel();
            var newHotSpot = new HotSpot({model: model, $parent: this.options.$parent});
            this.options.$parent.append(newHotSpot.$el);
            this.remove();

        },

        prepareHotSpotModel: function() {
            var model = this.model;
            model.set('_component', 'hotSpot');
            model.set('body', model.get('body'));
            model.set('instruction', model.get('instruction'));
            return model;
        }

    });

    Adapt.register("gMcq", GMcq);

    return GMcq;

});
# frozen_string_literal: true

module Decidim
  module NavigationMaps
    module ContentBlocks
      class NavigationMapSettingsFormCell < Decidim::ViewModel
        include NavigationMaps::NavigationMapCellHelpers

        self.view_paths << "#{Decidim::NavigationMaps::Engine.root}/app/cells/decidim/navigation_maps/content_blocks/navigation_map_settings_form"

        def show
          render
        end

        # Custom form for this Cell
        def form
          blueprint_form(organization_blueprints.first)
        end

        def blueprint_form(blueprint = nil)
          blueprint = Blueprint.new unless blueprint
          BlueprintForm.from_model(blueprint).with_context(organization: current_organization)
        end

        # it should come from the Engine Routes
        def blueprints_path
          "/admin/navigation_maps/blueprints"
        end
      end
    end
  end
end

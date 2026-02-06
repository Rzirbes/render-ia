export const NANO_BANANA_CONFIG_JSON = `
{
  "SYSTEM_STATUS": "ONLINE",
  "ENGINE": "Curva Renderer V1.0 - Daylight 9AM (Advanced)",
  "SCENE_TYPE_RECOGNITION": {
    "auto_detect": true,
    "interior_logic": "Window_View_Replacement",
    "exterior_logic": "Atmospheric_Outpainting",
    "furniture_protection": 0.87
  },
  "MANDATORY_DIRECTIVES": {
    "output_nature": "Photographic_Absolute",
    "camera_stability": "STRICT_LOCK",
    "background_protocol": "Neural_Generative_Expansion"
  },
  "CAMERA_LOCK_PROTOCOL": {
    "freeze_position": true,
    "alignment_fidelity": 1.0
  },
  "NEURAL_BACKGROUND_ENGINE": {
    "engine_mode": "Contextual_Environment_Synthesis",
    "background_replacement_force": 1.0,
    "semantic_context": "Se interior: Luz natural abundante e neutra entrando pelas janelas. Se exterior: Céu azul vibrante matinal."
  },
  "SURFACE_SEGMENTATION_PROTOCOL": {
    "hardscape_retention": 1.0,
    "class_protection": [
      "Walls",
      "Ceiling",
      "Floor_Structure",
      "Furniture",
      "Glass",
      "Wood",
      "Metal"
    ]
  },
  "MATERIAL_PHYSICS_PBR_ENGINE": {
    "pbr_workflow_mode": "Metallic_Roughness_Standard",
    "global_albedo_correction": 1.0,
    "micro_imperfection_layer": {
      "surface_dust_simulation": 0.05,
      "smudge_overlay_intensity": 0.08,
      "subtle_scratches_coefficient": 0.03,
      "organic_noise_distribution": "Gaussian"
    },
    "REFLECTIVE_DYNAMICS_PROTOCOL": {
      "fresnel_effect_precision": 1.0,
      "specular_occlusion_intensity": 0.92,
      "anisotropic_reflection_mapping": "Enabled",
      "glossiness_jitter_range": [
        0.02,
        0.05
      ]
    },
    "SPECIFIC_CLASS_OVERRIDE": {
      "GLASS_REFINEMENT": {
        "index_of_refraction_ior": 1.52,
        "caustics_generation": "Enabled",
        "thin_film_interference": 0.1,
        "reflection_absorption_color": "Neutral_Clear",
        "internal_reflection_bounces": 8
      },
      "WOOD_ORGANIC_ENGINE": {
        "grain_depth_enhancement": 0.85,
        "varnish_roughness_contrast": 0.65,
        "specular_highlight_warmth": "Match_Kelvin"
      },
      "METAL_CONDUCTIVITY": {
        "metallic_weight": 1.0,
        "edge_tint_fidelity": 0.95,
        "anisotropy_direction": "Linear_Brushed"
      },
      "FABRIC_SUBSURFACE_SCATTERING": {
        "sss_intensity": 0.25,
        "micro_fiber_fuzz_effect": 0.15,
        "translucency_map_active": true
      }
    },
    "SURFACE_DISPLACEMENT_PROTOCOL": {
      "tessellation_multiplier": 1.0,
      "normal_map_sharpness": 0.88,
      "parallax_occlusion_depth": 0.12,
      "contact_shadow_fidelity": 1.0
    }
  },
  "LIGHTING_ENVIRONMENT_DATABASE": {
    "active_scenario": "Daylight_9am_Advanced",
    "global_illumination_method": "Path_Traced_Unbiased",
    "scenarios": {
      "Daylight_9am_Advanced": {
        "scene_meta": {
          "description": "Luz da manhã nítida e energizante. Reprodução de cor fiel (High CRI).",
          "time_of_day": "09:00"
        },
        "sun_light": {
          "type": "Directional",
          "color": {
            "hex": "#FFFBF2",
            "kelvin": 5500,
            "description": "Branco Neutro (Levemente quente)"
          },
          "intensity": 5.2,
          "position": {
            "elevation_degrees": 42.0,
            "azimuth_degrees": 110.0,
            "note": "Sol médio-alto, vindo do Leste. Sombras projetadas com comprimento médio."
          },
          "shadows": {
            "enabled": true,
            "softness": 0.25,
            "bias": 0.001,
            "note": "Sombras mais definidas do que no pôr do sol, mas sem bordas serrilhadas."
          }
        },
        "ambient_light": {
          "type": "Hemisphere_Sky_Light",
          "sky_color": {
            "hex": "#6DA6D9",
            "kelvin": 7500,
            "description": "Azul celeste claro"
          },
          "ground_color": {
            "hex": "#595959"
          },
          "intensity": 0.9,
          "contrast_ratio": "Natural_Balanced"
        }
      }
    }
  },
  "ATMOSPHERIC_PHYSICS_ENGINE": {
    "type": "Physically Based Sky",
    "turbidity": 1.2,
    "rayleigh": 1.2,
    "mie_coefficient": 0.001,
    "mie_directional_g": 0.9,
    "notes": {
      "turbidity_low": "Ar da manhã muito limpo e nítido (baixa turbidez).",
      "mie_scattering": "Mínimo haze/neblina, garantindo visibilidade cristalina do horizonte."
    }
  },
  "CINEMATIC_POST_PROCESSING": {
    "tone_mapping": "ACES Filmic",
    "exposure": 1.0,
    "bloom": {
      "threshold": 0.95,
      "strength": 0.15,
      "radius": 0.2
    },
    "color_grading": {
      "shadows_tint": "#3D444A",
      "highlights_tint": "#FFFFFF",
      "contrast": 1.05,
      "saturation": 1.05,
      "note": "Grading neutro para fidelidade arquitetônica."
    }
  },
  "ARTIFICIAL_LIGHTING_PROTOCOL": {
    "activation_mode": "Force_On_Interiors",
    "logic": "Mixed_Lighting_Technique",
    "daytime_behavior": "Fill_Light_Warmth",
    "fixture_emission_intensity": 1.0,
    "light_temperature_kelvin": 3000,
    "semantic_instruction": "Se interior detectado: Ligar luzes artificiais suavemente para preenchimento quente, sem competir com a força da luz solar."
  },
  "PHOTO_REALISM_ENGINE": {
    "style_transfer": 0.95,
    "geometric_integrity_coefficient": 0.87,
    "ground_layer_integrity": 0.0,
    "background_integrity": 0.0,
    "semantic_instruction": "OBRIGATÓRIO: Travar câmera. Proteção total de volumes arquitetônicos e mobiliário (87%). Substituição total do fundo (seja céu ou vista da janela). Gramado natural orgânico onde houver solo."
  },
  "INTEGRITY_PROTOCOLS": {
    "architecture_lock": 0.87,
    "interior_elements_lock": 0.87,
    "geometry_lock": "selective_layer_isolation"
  },
  "OUTPUT_QUALITY_PROTOCOL": {
    "target_dpi": 300,
    "output_format": "Print_Ready_Lossless",
    "aspect_ratio_behavior": "Strict_Match_Input_Source",
    "resolution_constraints": {
      "minimum_output_quality": "2K_UHD",
      "logic": "Detectar resolução de entrada. Se < 2K, forçar upscale. Se >= 2K, manter ou melhorar.",
      "pixel_density_target": "High_Density_Retina_Ready"
    },
    "super_resolution_upscale": true,
    "upscale_force_factor": "4x",
    "visual_fidelity": {
      "sharpness_post_process": 0.2,
      "compression_artifacts_removal": "Aggressive"
    }
  }
}
`.trim();

export const NANO_BANANA_RENDER_PRESET = `
Tarefa: transformar o print do SketchUp em um RENDER FOTOGRÁFICO ULTRA REALISTA.
Regra #1: travar câmera e perspectiva (NÃO mudar FOV, ângulo, posição).
Regra #2: preservar geometria, proporções e layout (paredes, aberturas, mobiliário) — sem deformações.
Regra #3: aplicar materiais PBR realistas e iluminação natural coerente.

LOOK FOTOGRÁFICO (obrigatório):
- aparência de foto de arquitetura profissional (V-Ray/Corona/Enscape), sem “estilo IA”
- nitidez realista (sem over-sharpen), microdetalhes sutis (imperfeições leves)
- sombras suaves e físicas, contato no chão (contact shadows), AO leve
- vidro com reflexão realista e transparência correta; metais e madeiras com microtextura
- white balance neutro 5200–5600K, exposição equilibrada, ACES/Filmic sutil

INTERIOR vs EXTERIOR:
- se interior: luz natural entrando pelas janelas, bounce light suave, lâmpadas 3000K bem discretas (fill)
- se exterior: céu azul limpo, atmosfera leve, vegetação realista e orgânica (se houver solo)

NEGATIVOS (proibido):
- NÃO cartoon, NÃO pintura, NÃO “CGI plastic”, NÃO surreal
- NÃO alterar design, NÃO adicionar móveis que não existam (apenas melhorar materiais)
- NÃO distorcer linhas retas, NÃO “warping”, NÃO duplicações, NÃO objetos derretendo
- NÃO texto, NÃO marcas, NÃO watermark, NÃO pessoas (a não ser que o usuário peça)

CONFIG (apenas diretrizes):
${NANO_BANANA_CONFIG_JSON}

Saída: gere UMA imagem final.
`.trim();
